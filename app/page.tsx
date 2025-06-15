"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react"; // ใช้ไอคอนจาก lucide-react

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), { ssr: false });

export default function HomePage() {
  const [dataType, setDataType] = useState<"hotspot" | "flood">("hotspot");
  interface HotspotMapped {
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
  }
  const [hotspots, setHotspots] = useState<HotspotMapped[]>([]);
  type Rain = {
    id: string;
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
  const [rains, setRains] = useState<Rain[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("ทั้งหมด");
  const [sidebarOpen, setSidebarOpen] = useState(true); // 👉 เพิ่ม state
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";

  const provinces = [...new Set(rains.map((r) => r.province).filter(Boolean))];

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (dataType === "hotspot") {
          const res = await fetch(
            "https://api-gateway.gistda.or.th/api/2.0/resources/features/viirs/1day?limit=100&offset=0&ct_tn=ราชอาณาจักรไทย",
            {
              headers: {
                "Content-Type": "application/json",
                "api-key": apiKey,
              },
            }
          );
          const json = await res.json();
          interface HotspotFeature {
            id?: string;
            geometry: {
              coordinates: [number, number];
            };
            properties: {
              pv_tn?: string;
              pv_en?: string;
              amphoe?: string;
              tambol?: string;
              village?: string;
              acq_date?: string;
              acq_time?: string;
              frp?: number;
              confidence?: string;
              lu_name?: string;
              lu_hp_name?: string;
              linkgmap?: string;
            };
          }

          interface HotspotMapped {
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
          }

          const mapped: HotspotMapped[] = (json.features as HotspotFeature[]).map((f) => ({
            id: f.id ?? "",
            latitude: f.geometry.coordinates[1],
            longitude: f.geometry.coordinates[0],
            province: f.properties.pv_tn ?? "",
            pv_en: f.properties.pv_en ?? "",
            amphoe: f.properties.amphoe ?? "",
            tambol: f.properties.tambol ?? "",
            village: f.properties.village ?? "",
            acq_date: f.properties.acq_date ?? "",
            acq_time: f.properties.acq_time ?? "",
            frp: f.properties.frp ?? 0,
            confidence: f.properties.confidence ?? "",
            lu_name: f.properties.lu_name ?? "",
            lu_hp_name: f.properties.lu_hp_name ?? "",
            linkgmap: f.properties.linkgmap ?? "",
          }));
          setHotspots(mapped);
        } else if (dataType === "flood") {
          const res = await fetch("https://api-v3.thaiwater.net/api/v1/thaiwater30/public/rain_24h");
          const json = await res.json();
            interface RainApiItem {
            id: string;
            station: {
              tele_station_lat: number;
              tele_station_long: number;
              tele_station_name?: {
              th?: string;
              [key: string]: any;
              };
            };
            rain_24h: number;
            rainfall_datetime: string;
            geocode: {
              province_name?: { th?: string };
              amphoe_name?: { th?: string };
              tumbon_name?: { th?: string };
            };
            agency: {
              agency_name?: { th?: string };
            };
            basin?: {
              basin_name?: { th?: string };
            };
            }

            const mapped: Rain[] = (json.data as RainApiItem[]).map((item: RainApiItem) => ({
            id: item.id,
            latitude: item.station.tele_station_lat,
            longitude: item.station.tele_station_long,
            station_name: item.station.tele_station_name?.th ?? "-",
            rain_24h: item.rain_24h,
            rainfall_datetime: item.rainfall_datetime,
            province: item.geocode.province_name?.th ?? "",
            amphoe: item.geocode.amphoe_name?.th ?? "",
            tumbon: item.geocode.tumbon_name?.th ?? "",
            agency: item.agency.agency_name?.th ?? "",
            basin: item.basin?.basin_name?.th ?? "-",
            }));
          setRains(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
        setHotspots([]);
        setRains([]);
      }
    };

    fetchData();
  }, [dataType, apiKey]);

  const filteredRain =
    selectedProvince === "ทั้งหมด"
      ? rains
      : rains.filter((r) => r.province === selectedProvince);

  return (
    <div className="flex h-screen w-full relative">
      {/* Toggle Sidebar Button */}
      <button
        className="absolute top-4 left-4 z-[1000] p-2 bg-white dark:bg-gray-800 rounded shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 ease-in-out bg-gray-100 dark:bg-gray-800 p-4 border-r border-gray-300 dark:border-gray-700 ${
          sidebarOpen ? "w-60" : "w-0 overflow-hidden"
        }`}
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">เลือกข้อมูล</h2>
        <ul className="space-y-2 mb-4">
          <li>
            <button
              className={`w-full text-left px-3 py-2 rounded ${
                dataType === "hotspot"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
              onClick={() => setDataType("hotspot")}
            >
              🔥 ไฟป่า (Hotspots)
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left px-3 py-2 rounded ${
                dataType === "flood"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
              onClick={() => setDataType("flood")}
            >
              🌧 ฝน 24 ชั่วโมง
            </button>
          </li>
        </ul>

        {dataType === "flood" && (
          <div className="mb-2">
            <label
              htmlFor="province"
              className="block mb-1 text-sm font-medium text-gray-800 dark:text-gray-200"
            >
              จังหวัด
            </label>
            <select
              id="province"
              className="w-full p-2 border border-gray-300 rounded bg-white dark:bg-gray-700 dark:text-white"
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
            >
              <option value="ทั้งหมด">ทั้งหมด</option>
              {provinces.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        )}
      </aside>

      {/* Map */}
      <main className="flex-1">
        <LeafletMap
          type={dataType}
          points={
            dataType === "hotspot"
              ? (hotspots as any) // or as Hotspot[]
              : (filteredRain as any) // or as RainPoint[]
          }
        />
      </main>
    </div>
  );
}