import { useEffect, useMemo, useState } from "react";
import {
  DevicesListData,
  PermissionState,
  useDeviceListProps,
} from "../types/useDeviceList.d";

/**
 *
 * @description 获取设备列表,包括摄像头,麦克风,扬声器;并且可以获取当前默认设备信息
 * @param props {onUpdated} 当设备列表更新时触发
 * @returns DevicesListData
 * @example
 * const {
 *  userAudioInputs,
 * userAudioOutputs,
 * currentAudioInputDevice,
 * currentAudioOutputDevice,
 * } = useDevicesList({});
 */
export function useDeviceList(props: useDeviceListProps): DevicesListData {
  const navigator = window.navigator;
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [microphonePermission, setMicrophonePermission] = useState(
    PermissionState.DENIED
  );
  const videoInputs = useMemo(
    () => devices.filter((i) => i.kind === "videoinput"),
    [devices]
  );
  const audioInputs = useMemo(
    () => devices.filter((i) => i.kind === "audioinput"),
    [devices]
  );
  const audioOutputs = useMemo(
    () => devices.filter((i) => i.kind === "audiooutput"),
    [devices]
  );
  const userAudioInputs = useMemo(
    () =>
      audioInputs.filter(
        (i) => i.deviceId !== "default" && i.deviceId !== "communications"
      ),
    [audioInputs]
  );
  const userAudioOutputs = useMemo(
    () =>
      audioOutputs.filter(
        (i) => i.deviceId !== "default" && i.deviceId !== "communications"
      ),
    [audioOutputs]
  );
  const currentAudioInputDevice = useMemo(
    () => audioInputs.find((i) => i.deviceId === "default"),
    [audioInputs]
  ) as MediaDeviceInfo;
  const currentAudioOutputDevice = useMemo(
    () => audioOutputs.find((i) => i.deviceId === "default"),
    [audioOutputs]
  ) as MediaDeviceInfo;
  const isSupported = useMemo(
    () =>
      Boolean(
        navigator &&
          navigator.mediaDevices &&
          navigator.mediaDevices.enumerateDevices
      ),
    [navigator]
  );
  async function update() {
    if (!isSupported) return;
    const _devices = await navigator!.mediaDevices.enumerateDevices();
    setDevices(_devices);
    props.onUpdated && props.onUpdated(_devices);
  }
  // 权限检测
  async function checkMicrophonePermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      // 如果获取媒体流成功，表示用户已经授予麦克风权限
      setMicrophonePermission(PermissionState.GRANTED);

      // 关闭获取媒体流的轨道
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach((track) => track.stop());
    } catch (error: any) {
      // 如果获取媒体流失败，可能是因为用户拒绝了权限请求
      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        setMicrophonePermission(PermissionState.DENIED);
      } else {
        setMicrophonePermission(PermissionState.PROMPT);
      }
    }
  }
  useEffect(() => {
    isSupported && update();
    navigator!.mediaDevices.addEventListener("devicechange", update);
    return () => {
      navigator!.mediaDevices.removeEventListener("devicechange", update);
    };
  }, [navigator]);
  useEffect(() => {
    checkMicrophonePermission();
  }, [navigator, devices]);

  return {
    devices,
    videoInputs,
    isSupported,
    microphonePermission,
    userAudioInputs,
    userAudioOutputs,
    currentAudioInputDevice,
    currentAudioOutputDevice,
  };
}
