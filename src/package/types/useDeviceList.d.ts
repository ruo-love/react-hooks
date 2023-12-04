export enum PermissionState {
  GRANTED = "granted",
  DENIED = "denied",
  PROMPT = "prompt",
}
export interface DevicesListData {
  devices: MediaDeviceInfo[]; //所有设备信息
  currentAudioInputDevice: MediaDeviceInfo; //当前默认麦克风
  currentAudioOutputDevice: MediaDeviceInfo; //当前默认扬声器
  videoInputs: MediaDeviceInfo[]; //摄像头设备
  userAudioInputs: MediaDeviceInfo[]; //系统和外部连接的麦克风设备
  userAudioOutputs: MediaDeviceInfo[]; //系统和外部连接的扬声器设备
  isSupported: boolean; //是否支持
  microphonePermission: PermissionState; //麦克风权限 granted ,denied,error
}

export type useDeviceListProps = {
    onUpdated?: (devices: MediaDeviceInfo[]) => void;
  };