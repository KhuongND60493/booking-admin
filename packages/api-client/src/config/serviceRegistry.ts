export enum ServiceName {
  Default = "default",
}

const SERVICE_PREFIX: Record<ServiceName, string> = {
  [ServiceName.Default]: "",
};

export function getServicePrefix(service: ServiceName): string {
  return SERVICE_PREFIX[service];
}
