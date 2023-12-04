import { useDeviceListProps, DevicesListData } from "./useDeviceList";
declare module "@zrcode/react-hooks" {
  export function useDeviceList(props: useDeviceListProps): DevicesListData;
}
