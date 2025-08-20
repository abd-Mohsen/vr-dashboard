import { useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { useMemo } from 'react'
import * as THREE from 'three'
import React from 'react'

type ModelProps = {
  url: string
}

export function Model({ url }: ModelProps) {
  const ext = useMemo(() => url.split('.').pop()?.toLowerCase(), [url])

  if (ext === 'obj') {
    const obj = useLoader(OBJLoader, url) as THREE.Object3D
    return <primitive object={obj} scale={1} />
  }

  // GLTF/GLB
  const dracoLoader = useMemo(() => {
    const draco = new DRACOLoader()
    draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
    return draco
  }, [])

  const gltfLoader = useMemo(() => {
    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)
    return loader
  }, [dracoLoader])

  // Use the GLTFLoader directly
  const gltf = useLoader(GLTFLoader, url)
  return <primitive object={gltf.scene} scale={1} />
}
