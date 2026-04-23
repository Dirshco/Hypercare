export async function connectBPDevice(onReading) {
  const device = await navigator.bluetooth.requestDevice({
    filters: [{ services: ['blood_pressure'] }]
  });

  const server = await device.gatt.connect();
  const service = await server.getPrimaryService('blood_pressure');
  const characteristic = await service.getCharacteristic('blood_pressure_measurement');

  await characteristic.startNotifications();

  characteristic.addEventListener('characteristicvaluechanged', event => {
    const value = event.target.value;
    const systolic = value.getUint16(1, true);
    const diastolic = value.getUint16(3, true);
    onReading(systolic, diastolic);
  });
}
