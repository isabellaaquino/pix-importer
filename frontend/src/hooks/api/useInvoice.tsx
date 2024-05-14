import { client_id } from "../../App";

const BASE_URL = "http://127.0.0.1:8000/api";

export function useInvoice() {
  async function uploadInvoices({
    invoices,
    institution,
  }: {
    invoices: FileList;
    institution?: String;
  }): Promise<{ [key: string]: string } | null> {
    try {
      let endpoint = `${BASE_URL}/import/?institution=${institution}&client_id=${client_id}`;

      const formData = new FormData();
      Array.from(invoices).forEach((file, index) => {
        formData.append(`file${index}`, file); // Append file with unique name
      });

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        mode: "cors",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${errorMessage}`
        );
      }

      return await response.json();
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }

  return { uploadInvoices };
}
