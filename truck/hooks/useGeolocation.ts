// FreteConnect - Hook de Geolocalização
"use client"

import { useState, useEffect, useCallback } from "react"

interface GeoPosition {
  latitude: number
  longitude: number
  accuracy: number
  altitude?: number | null
  altitudeAccuracy?: number | null
  heading?: number | null
  speed?: number | null
  timestamp: number
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
  watch?: boolean
  onSuccess?: (position: GeoPosition) => void
  onError?: (error: GeolocationPositionError) => void
}

interface UseGeolocationReturn {
  position: GeoPosition | null
  error: GeolocationPositionError | string | null
  loading: boolean
  supported: boolean
  getCurrentPosition: () => void
  clearWatch: () => void
}

export function useGeolocation(options: UseGeolocationOptions = {}): UseGeolocationReturn {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    watch = false,
    onSuccess,
    onError,
  } = options

  const [position, setPosition] = useState<GeoPosition | null>(null)
  const [error, setError] = useState<GeolocationPositionError | null>(null)
  const [loading, setLoading] = useState(false)
  const [watchId, setWatchId] = useState<number | null>(null)

  const supported = typeof window !== "undefined" && "geolocation" in navigator

  const handleSuccess = useCallback(
    (pos: GeolocationPosition) => {
      const geoPosition: GeoPosition = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        altitude: pos.coords.altitude,
        altitudeAccuracy: pos.coords.altitudeAccuracy,
        heading: pos.coords.heading,
        speed: pos.coords.speed,
        timestamp: pos.timestamp,
      }

      setPosition(geoPosition)
      setError(null)
      setLoading(false)
      onSuccess?.(geoPosition)
    },
    [onSuccess]
  )

  const handleError = useCallback(
    (err: GeolocationPositionError) => {
      setError(err)
      setLoading(false)
      onError?.(err)
    },
    [onError]
  )

  const getCurrentPosition = useCallback(() => {
    if (!supported) {
      console.error("Geolocalização não suportada")
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy,
      timeout,
      maximumAge,
    })
  }, [supported, enableHighAccuracy, timeout, maximumAge, handleSuccess, handleError])

  const clearWatch = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }
  }, [watchId])

  useEffect(() => {
    if (!supported || !watch) return

    const id = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy,
      timeout,
      maximumAge,
    })

    setWatchId(id)

    return () => {
      navigator.geolocation.clearWatch(id)
    }
  }, [supported, watch, enableHighAccuracy, timeout, maximumAge, handleSuccess, handleError])

  return {
    position,
    error,
    loading,
    supported,
    getCurrentPosition,
    clearWatch,
  }
}

// Hook para enviar localização para API
export function useTrackLocation(freteId?: string, intervalMs: number = 30000) {
  const [tracking, setTracking] = useState(false)
  const [lastSent, setLastSent] = useState<Date | null>(null)

  const sendLocation = useCallback(async (position: GeoPosition) => {
    try {
      await fetch("/api/localizacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: position.latitude,
          longitude: position.longitude,
          velocidade: position.speed ? position.speed * 3.6 : undefined, // m/s para km/h
          direcao: position.heading || undefined,
          precisao: position.accuracy,
          freteId: freteId || undefined,
        }),
      })
      setLastSent(new Date())
    } catch (error) {
      console.error("Erro ao enviar localização:", error)
    }
  }, [freteId])

  const geolocation = useGeolocation({
    watch: tracking,
    enableHighAccuracy: true,
    onSuccess: sendLocation,
  })

  useEffect(() => {
    if (!tracking || !geolocation.position) return

    const interval = setInterval(() => {
      if (geolocation.position) {
        sendLocation(geolocation.position)
      }
    }, intervalMs)

    return () => clearInterval(interval)
  }, [tracking, geolocation.position, intervalMs, sendLocation])

  return {
    ...geolocation,
    tracking,
    startTracking: () => setTracking(true),
    stopTracking: () => {
      setTracking(false)
      geolocation.clearWatch()
    },
    lastSent,
  }
}
