import os
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, BackgroundTasks, Request, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from importer import IMPORTED_FILES_PATH, PDFInvoiceImporter, InvoiceProcessingException


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield

origins = ["*"]
def create_app():
    app = FastAPI(lifespan=lifespan)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return app


app = create_app()


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[int, WebSocket] = {}

    async def connect(self, websocket: WebSocket, client_id: int) -> None:
        await websocket.accept()
        self.active_connections[client_id] = websocket

    def disconnect(self, client_id: int) -> None:
        self.active_connections.pop(client_id)

    def get_web_socket(self, client_id: int):
        return self.active_connections[client_id]

    async def send_api_response(self, response, websocket: WebSocket):
        await websocket.send_json(response)


manager = ConnectionManager()


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(web_socket: WebSocket, client_id: int):
    print("Handshaking...")
    await manager.connect(web_socket, client_id)
    print("Conexão aceita!")
    while True:
        try:
            data = await web_socket.receive()
            print(data)
        except WebSocketDisconnect:
            manager.disconnect(client_id)
            print("Conexão perdida.")
            break


@app.post("/api/import")
async def import_pix(
    institution: str,
    client_id: int,
    request: Request,
    background_tasks: BackgroundTasks
) -> dict:
    form_data = await request.form()
    file_list = [form_data.getlist(key)[0] for key in form_data.keys()]
    file_bytes = [await file.read() for file in file_list]

    # INVOCA BACKGROUND TASK E LIBERA A RESPONSE
    background_tasks.add_task(background_import, file_bytes, institution, client_id)
    return {'message': "Importação iniciada..."}


async def background_import(file_bytes, institution, client_id):
    try:
        websocket = manager.get_web_socket(client_id)
    except KeyError:
        return
    successfully_imported = []

    file_path = f'{IMPORTED_FILES_PATH}/buffer.pdf'

    for uploaded_file in file_bytes:
        with open(file_path, 'wb') as file:
            file.write(uploaded_file)
        try:
            invoice_dict = PDFInvoiceImporter(file_path, institution).process_file()
        except InvoiceProcessingException:
            os.remove(file_path)
            return HTTPException

        os.remove(file_path)

        if not invoice_dict.get('value') and not invoice_dict.get('date'):
            return HTTPException

        successfully_imported.append(invoice_dict)
        time.sleep(2)

    response = {'result': successfully_imported, "message": "Importação finalizada com sucesso!"}

    await manager.send_api_response(response, websocket)
