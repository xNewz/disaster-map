'use client';
import { useEffect, useRef } from 'react';
import Highcharts from 'highcharts/highmaps';
import HighchartsReact from 'highcharts-react-official';

export default function ThailandMap() {
  const chartRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/th/th-all.topo.json'
      ).then(res => res.json());

      const options: Highcharts.Options = {
        chart: {
          map: topology as any
        },
        title: {
          text: '' // ไม่แสดงชื่อหัวข้อ
        },
        subtitle: {
          text: '' // ไม่แสดง subtitle
        },
        mapNavigation: {
          enabled: true,
          buttonOptions: {
            verticalAlign: 'bottom'
          }
        },
        colorAxis: {
          visible: false // ไม่ต้องมีแกนสี
        },
        series: [
          {
            type: 'map',
            name: 'จังหวัด',
            data: [], // ไม่มีข้อมูล value
            borderColor: '#ffffff',
            nullColor: '#ecf0f1', // สีพื้นหลังจังหวัด
            states: {
              hover: {
                color: '#3498db' // สีเมื่อ hover
              }
            },
            dataLabels: {
              enabled: true,
              format: '{point.name}', // ชื่อจังหวัด
              style: {
                fontSize: '10px'
              }
            }
          }
        ]
      };

      if (chartRef.current) {
        chartRef.current.chart.update(options as any, true, true);
      }
    })();
  }, []);

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={'mapChart'}
        options={{}} // เริ่มต้นเปล่า ๆ
        ref={chartRef}
      />
    </div>
  );
}