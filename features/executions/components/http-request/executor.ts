import { NodeExecutor } from "@/features/executions/type";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

type HttpRequestData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  if (!data.endpoint) {
    throw new NonRetriableError("HTTP Request node missing endpoint");
  }
  if (!data.variableName) {
    throw new NonRetriableError(
      "Variable name is required for HTTP Request node"
    );
  }
  const result = await step.run(`http-request`, async () => {
    const endpoint = data.endpoint as string;
    const method = data.method;

    const options: KyOptions = { method };

    if (["POST", "PUT", "PATCH", "DELETE"].includes(method || "")) {
      options.body = data.body;
      options.headers = {
        "Content-Type": "application/json",
        ...data.headers,
      };
    }
    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");
    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    const responsePayload = {
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };
    return {
      ...context,
      [data.variableName as string]: responsePayload,
    };
  });

  return result;
};
