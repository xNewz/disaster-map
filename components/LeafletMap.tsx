"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

type Hotspot = {
  id: string;
  latitude: number;
  longitude: number;
  province: string;
  pv_en: string;
  amphoe: string;
  tambol: string;
  village: string;
  acq_date: string;
  acq_time: string;
  frp: number;
  confidence: string;
  lu_name: string;
  lu_hp_name: string;
  linkgmap: string;
};

type RainPoint = {
  id: number;
  latitude: number;
  longitude: number;
  station_name: string;
  rain_24h: number;
  rainfall_datetime: string;
  province: string;
  amphoe: string;
  tumbon: string;
  agency: string;
  basin: string;
};

type Props = {
  type: "hotspot" | "flood";
  points: Hotspot[] | RainPoint[];
};

// แก้ปัญหา icon ไม่แสดง
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function LeafletMap({ type, points }: Props) {
  return (
    <MapContainer
      center={[13.736717, 100.523186]}
      zoom={6}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {points.map((point: any) => (
        <Marker key={point.id} position={[point.latitude, point.longitude]}>
          <Popup>
            {type === "hotspot" ? (
              <>
                <div
                  style={{
                    marginBottom: "0.5rem",
                    fontWeight: 600,
                    fontSize: "1rem",
                    color: "#dc2626",
                  }}
                >
                  🔥 จุดความร้อนใน {point.province}
                </div>
                <div>
                  <strong>อำเภอ:</strong> {point.amphoe}
                </div>
                <div>
                  <strong>ตำบล:</strong> {point.tambol}
                </div>
                <div>
                  <strong>หมู่บ้าน:</strong> {point.village || "ไม่ระบุ"}
                </div>
                <div>
                  <strong>วันที่:</strong> {point.acq_date}
                </div>
                <div>
                  <strong>เวลา:</strong> {point.acq_time}
                </div>
                <div>
                  <strong>FRP:</strong>{" "}
                  <span
                    style={{
                      color: "#f87171",
                      fontWeight: 600,
                    }}
                  >
                    {point.frp}
                  </span>
                </div>
                <div>
                  <strong>ความเชื่อมั่น:</strong>{" "}
                  <span
                    style={{
                      color:
                        point.confidence === "high"
                          ? "#22c55e"
                          : point.confidence === "nominal"
                          ? "#facc15"
                          : "#94a3b8",
                      fontWeight: 600,
                    }}
                  >
                    {point.confidence}
                  </span>
                </div>
                <div>
                  <strong>ประเภทที่ดิน:</strong> {point.lu_name} (
                  {point.lu_hp_name})
                </div>
                <a
                  href={point.linkgmap}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: "0.75rem",
                    padding: "0.35rem 0.75rem",
                    background: "#2563eb",
                    color: "white",
                    borderRadius: "6px",
                    textDecoration: "none",
                    fontWeight: 500,
                    fontSize: "0.85rem",
                  }}
                >
                  เปิดใน Google Maps
                </a>
              </>
            ) : (
              <div
                style={{
                  marginBottom: "0.5rem",
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: "#2563eb",
                }}
              >
                <strong>🌧 ฝน 24 ชั่วโมง</strong>
                <div style={{ fontWeight: 400, color: "#222", fontSize: "0.95rem" }}>
                  <div>
                    <strong>สถานี:</strong> {point.station_name}
                  </div>
                  <div>
                    <strong>จังหวัด:</strong> {point.province}
                  </div>
                  <div>
                    <strong>อำเภอ:</strong> {point.amphoe}
                  </div>
                  <div>
                    <strong>ตำบล:</strong> {point.tumbon}
                  </div>
                  <div>
                    <strong>เวลา:</strong> {point.rainfall_datetime}
                  </div>
                  <div>
                    <strong>ปริมาณฝน:</strong>{" "}
                    <span style={{ color: "#0ea5e9", fontWeight: 600 }}>
                      {point.rain_24h} มม.
                    </span>
                  </div>
                  <div>
                    <strong>หน่วยงาน:</strong> {point.agency}
                  </div>
                  <div>
                    <strong>ลุ่มน้ำ:</strong> {point.basin}
                  </div>
                </div>
              </div>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
