import Head from "next/head";


import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";

const inter = Inter({ subsets: ["latin"]});

export default function Home() {

  const router = useRouter();
  return (
    <UserLayout>
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        <div className={styles.mainContainer_left}>
            <p>Connect. Grow. Inspire.</p>
            <p>A professional networking platform built for modern connections.</p>

            <div onClick={() => {
              router.push("/login")
            }} className={styles.buttonJoin}>
               <p>Join Now</p>
            </div>
        </div>



        <div className={styles.mainContainer_right}>
          <Image src="/images/CONNECTIVITY.png" 
          alt="Connectivity Illustration" 
          width={500}                   
          height={300}
          ></Image>
        </div>

      </div>
    </div>
      




      
    </UserLayout>
  );
}
