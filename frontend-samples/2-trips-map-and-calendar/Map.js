'use client'
import Image from "next/image";
import MapImg from "../../public/images/map.svg";
import { useEffect, useState } from "react";
import { getMarkers } from "@/app/api";

export default function Map() {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    getMarkers(e => setMarkers(e));
  }, [])

  return (
    <>
      <div
        className="position-relative"
      >
        <Image
          alt="ewangelibusowa-mapa"
          className="w-100 h-auto"
          src={MapImg}
        />
        {markers.map((e, index) => (
          <Image
            key={`marker-${index}`}
            src={e.visited ? "/icons/visited.svg" : "/icons/planned.svg"}
            alt="marker"
            width={64}
            height={64}
            className="marker position-absolute"
            style={{
              left: `${e.x}%`,
              top: `${e.y}%`,
              transform: "translate(-50%, -25px)"
            }}
          />
        ))}
      </div>
    </>
  );
}