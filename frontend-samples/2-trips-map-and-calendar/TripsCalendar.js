"use client"

import { getTripsForCalendar } from "@/app/api";
import { defaultDateFormat } from "@/helpers/utils/date";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TripsCalendar({ planned }) {
  const [trips, setTrips] = useState({ totalPages: 0, trips: [], currentPage: 1, loading: true });

  useEffect(() => {
    getTripsForCalendar(planned, trips.currentPage, e => setTrips(e), trips);
  }, [trips.currentPage])

  const tripsContainer = {
    marginTop: "20px",
    padding: "40px",
    border: `2px solid ${planned ? "#EDBD4C" : "#86BD74"}`,
    boxSizing: "border-box"
  }

  const Arrow = ({ left }) => (
    <Image
      onClick={() => !left ? trips.currentPage < trips.totalPages && setTrips({ ...trips, currentPage: trips.currentPage + 1 }) : trips.currentPage > 1 && setTrips({ ...trips, currentPage: trips.currentPage - 1 })}
      className="cursor-pointer"
      style={{ marginRight: `${left ? "12px" : "0"}`, marginLeft: `${left ? "0" : "12px"}`, transform: `rotate(${left ? "180deg" : "0deg"})` }}
      height={24}
      width={24}
      src={planned ? "icons/arrow1.svg" : "icons/arrow-green.svg"}
      alt="arrow"
    />
  );

  return (
    <div
      className="mt-5">
      <div className="d-flex align-items-center">
        <Image
          width={38}
          height={38}
          alt="icon"
          src={planned ? "icons/planned.svg" : "icons/visited.svg"}
        />
        <p className="h4 d-inline-block fw-bold mb-0">{planned ? "Zaplanowane trasy" : "Odwiedzone miejsca"}</p>
      </div>
      <div
        style={tripsContainer}
      >
        <div>
          {
            !trips.loading && trips.trips.map((e, index) => (
              <Link key={`${e.city}-${index}`} href={`/trasa/${e.id}`} passHref legacyBehavior>
                <div
                  style={{
                    fontSize: "20px",
                    lineHeight: "32px",
                    letterSpacing: "0em",
                    textAlign: "left"
                  }}
                  className="row cursor-pointer">
                  <div className="col-10">
                    {`${defaultDateFormat(e.dateOfTheVisit)} - ${e.city}`}
                  </div>
                  <div className="col-2">
                    <Image
                      alt="arrow"
                      height={12}
                      width={12}
                      src="/icons/blackArrow.svg"
                    />
                  </div>
                </div>
              </Link>
            ))
          }
        </div>
        <div className="text-end mt-3">
          <Arrow
            left
            planned
          />
          {trips.currentPage} z {trips.totalPages}
          <Arrow />
        </div>
        {
          planned ?
            <p className="yellow-color mt-2">Jeżeli chcesz, aby EwangeliBus pojawił się w Twoich stronach, skontaktuj się z nami!</p>
            :
            <p className="green-color mt-2">Zobacz relację z naszych tras!</p>
        }
      </div>
    </div >
  );
}