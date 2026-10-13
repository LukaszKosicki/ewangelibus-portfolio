import Map from "@/components/Map";
import TripsCalendar from "@/components/TripsCalendar";
import Image from "next/image";
import styles from "./mapSection.module.css";
import Link from "next/link";
import LearnDetailsButton from "@/components/buttons/LearnDetailsButton";
import ZoomMap from "@/components/ZoomMap";

export default function MapSection() {
  return (
    <section className="mt-5">
      <div className="container">
        <div className="row">
          <div className="col col-12 col-xl-6 col-xxl-5">
            <TripsCalendar
              planned={true}
            />
            <TripsCalendar
              planned={false}
            />
            <LearnDetailsButton />
          </div>
          <div className="d-flex flex-column justify-content-center col mt-5 col-12 col-xl-6 col-xxl-7">
            <Map />
          </div>
        </div>
      </div>
    </section>
  );
}