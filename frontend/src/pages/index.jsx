import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";

export default function Home() {
  const router = useRouter();
  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />

        <div className={styles.mainContainer}>
          <div className={styles.left}>
            <span className={styles.eyebrow}>Professional Networking</span>
            <h1 className={styles.headline}>
              Connect.<br />
              <em>Grow.</em><br />
              Inspire.
            </h1>
            <p className={styles.sub}>
              A modern platform built for real connections — not noise.
            </p>
            <button onClick={() => router.push("/login")} className={styles.ctaBtn}>
              Join Nexus
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>

          <div className={styles.right}>
            <div className={styles.imageGlow} />
            <Image
              src="/images/CONNECTIVITY.png"
              alt="Connectivity"
              width={500}
              height={300}
              className={styles.heroImage}
            />
          </div>
        </div>
      </div>
    </UserLayout>
  );
}