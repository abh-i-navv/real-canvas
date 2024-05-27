"use client"
import { Canvas } from "./components/canvas";

export default function Home() {

  const onPointerDown = () =>{
    console.log(1)
  }

  const layer = { x: 100,
    y:100,
    width:200,
    height:200}

  return (
    <main >
      <div className="h-full w-full flex justify-center items-center overflow-y-scroll no-scrollbar overflow-hidden">
        <Canvas />
      </div>
    </main>
  );
}
