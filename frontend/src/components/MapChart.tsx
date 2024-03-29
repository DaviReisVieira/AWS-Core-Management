import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation,
} from "react-simple-maps";

import styles from "../styles/components/MapChart.module.css";

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-continents.json";

const allRegionsGeo = [
  { name: "us-east-1", lat: -80.543, lng: 41.783, y_coord: -10 },
  { name: "us-east-2", lat: -82.908, lng: 37.417 },
  { name: "us-west-1", lat: -120.74, lng: 47.751, y_coord: -10 },
  { name: "us-west-2", lat: -118.74, lng: 40.751 },
  { name: "ap-east-1", lat: 114.171, lng: 22.285 },
  { name: "ap-south-1", lat: 72.877, lng: 19.076 },
  { name: "ap-northeast-3", lat: 139.691, lng: 35.689 },
  { name: "ap-northeast-2", lat: 127.766, lng: 35.18, y_coord: -10 },
  { name: "ap-northeast-1", lat: 139.691, lng: 35.689 },
  { name: "ap-southeast-1", lat: 103.819, lng: 1.352 },
  { name: "ap-southeast-2", lat: 151.209, lng: -33.868, y_coord: -10 },
  { name: "ca-central-1", lat: -106.346, lng: 56.13 },
  { name: "eu-central-1", lat: 10.451, lng: 51.165 },
  { name: "eu-west-1", lat: -8.243, lng: 53.412 },
  { name: "eu-west-2", lat: -0.127, lng: 51.507, y_coord: -10 },
  { name: "eu-west-3", lat: 2.352, lng: 48.856 },
  { name: "eu-north-1", lat: 18.068, lng: 59.329 },
  { name: "sa-east-1", lat: -46.633, lng: -23.55 },
];

export default function MapChart({ regions }: any) {
  const [markers, setMarkers] = useState<any>([]);
  useEffect(() => {
    const markers = regions.map((region: any) => {
      const geo: any = allRegionsGeo.find((geo) => geo.name === region.region);
      return {
        name: region.region,
        y_coord: geo.y_coord || 12,
        coordinates: [geo.lat, geo.lng],
        userGroup: region.json_config.users_groups.length,
        users: region.json_config.users.length,
        securityGroups: region.json_config.security_groups.length,
        instances: region.json_config.instances.length,
        showData: false,
      };
    });

    setMarkers(markers);
  }, [regions]);

  return (
    <ComposableMap
      projection={"geoMercator"}
      projectionConfig={{
        scale: 100,
        center: [0, 25],
      }}
      width={640}
      height={260}
    >
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="#d78b11"
              stroke="#232f3f"
            />
          ))
        }
      </Geographies>
      {markers.map(
        ({
          name,
          coordinates,
          showData,
          userGroup,
          users,
          securityGroups,
          instances,
          y_coord,
        }: any) => (
          <Marker
            key={name}
            coordinates={coordinates}
            onMouseEnter={() => {
              setMarkers(
                markers.map((marker: any) => {
                  if (marker.name === name) {
                    return {
                      ...marker,
                      showData: true,
                    };
                  }
                  return marker;
                })
              );
            }}
            onMouseLeave={() => {
              setMarkers(
                markers.map((marker: any) => {
                  if (marker.name === name) {
                    return {
                      ...marker,
                      showData: false,
                    };
                  }
                  return marker;
                })
              );
            }}
          >
            <Link href={`region/${name}`}>
              <circle r={2} fill="#232f3f" stroke="#fff" strokeWidth={1} />
              {showData && (
                <text
                  y={y_coord}
                  style={{
                    fill: "#fff",
                    fontSize: 8,
                    fontWeight: 600,
                    direction: "rtl",
                  }}
                >
                  <tspan x={15} y={+5}>
                    Região: {name}
                  </tspan>
                  <tspan x={15} y={+15}>
                    Grupos de Usuários: {userGroup}
                  </tspan>
                  <tspan x={15} y={+25}>
                    Usuários: {users}
                  </tspan>
                  <tspan x={15} y={+35}>
                    Grupos de Segurança: {securityGroups}
                  </tspan>
                  <tspan x={15} y={+45}>
                    Instâncias: {instances}
                  </tspan>
                </text>
              )}
              <text
                textAnchor="middle"
                y={y_coord}
                style={{
                  fill: "#fff",
                  fontSize: 9,
                  fontWeight: 300,
                }}
              >
                {name}
              </text>
            </Link>
          </Marker>
        )
      )}
    </ComposableMap>
  );
}
