import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { ShopResponse } from '../../../../shared/types/response/ShopResponse'

type ShopMapProps = {
  shops: ShopResponse[]
  hoveredShopId: number | null
  focusedShop?: ShopResponse | null
}

export default function ShopMap({ shops, hoveredShopId, focusedShop }: ShopMapProps) {
  const mapRef = useRef<maplibregl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<maplibregl.Marker[]>([])
  const apiKey = process.env.REACT_APP_LOCATION_KEY

  const region = 'us-east-1'
  const styleName = 'Standard'
  const colorScheme = 'Light'

  useEffect(() => {
    if (!mapContainerRef.current) return

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://maps.geo.${region}.amazonaws.com/v2/styles/${styleName}/descriptor?key=${apiKey}&color-scheme=${colorScheme}`,
      center: [106.7009, 10.7769],
      zoom: 12,
      maxTileCacheSize: 128,
      transformRequest: (url, resourceType) => {
        if (resourceType === 'Tile') {
          // Debug tile request nếu cần
        }
        return { url }
      },
    })

    mapRef.current = map
    map.addControl(new maplibregl.NavigationControl(), 'top-left')

    // Debounce zoom/pan để tránh trigger liên tục
    let debounceTimer: NodeJS.Timeout | null = null

    const onMapIdle = () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        // Bạn có thể xử lý sự kiện map chuyển động ở đây nếu muốn
      }, 500)
    }

    map.on('moveend', onMapIdle)
    map.on('zoomend', onMapIdle)

    return () => {
      map.remove()
    }
  }, [])

  // Cập nhật markers khi danh sách shop hoặc hoveredShopId thay đổi
  useEffect(() => {
    if (!mapRef.current) return

    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    shops.forEach((shop) => {
      if (shop.latitude == null || shop.longitude == null) return

      const el = document.createElement('div')
      el.className = 'marker'
      el.style.width = '16px'
      el.style.height = '16px'
      el.style.borderRadius = '50%'
      el.style.background = shop.id === hoveredShopId ? '#f87171' : '#3b82f6'
      el.style.border = '2px solid white'
      el.style.boxShadow = '0 0 4px rgba(0,0,0,0.3)'

      const popupHTML = `
        <div style="
            min-width:160px; max-width:230px;
            background: #fff;
            border-radius: 1rem;
            box-shadow: 0 8px 22px 0 rgba(30,30,60,0.19), 0 1px 3px rgba(20,20,40,0.07);
            display: flex;
            align-items: flex-start;
            font-family: 'Inter','Quicksand','Roboto',sans-serif;
            position:relative;
        ">
            <div style="flex:1;display:flex;flex-direction:column; gap:4px; min-width:0; margin:0;">
            <div style="
                font-weight:700;
                font-size:1.08rem;
                color:#22223a;
                word-break:break-word;
                line-height:1.2;
                margin-bottom:0.5px;
                margin-top:7px;
                margin-left:13px;
            ">
                ${shop.shopName}
            </div>
            <div style="
                color:#6366f1;
                font-size:0.97rem;
                font-weight:600;
                max-width:135px;
                margin-left:13px;
                line-height:1.18;
                margin-bottom:1.5px;
                text-overflow:ellipsis;
                white-space:nowrap;
                overflow:hidden;
            ">
                ${shop.addressLabel ?? ''}
            </div>
            <div style="
                color:#64748b;
                font-size:0.935rem;
                font-weight:500;
                letter-spacing:0.01em;
                margin:0 0 9px 13px;
                line-height:1.18;
            ">
                Lat <span style="font-weight:700;color:#14b8a6">${shop.latitude?.toFixed?.(5) ?? ''}</span>
                / Lng <span style="font-weight:700;color:#60a5fa">${shop.longitude?.toFixed?.(5) ?? ''}</span>
            </div>
            </div>
            <img
            src="${shop.image || '/default-shop.png'}"
            alt="shop logo"
            style="
                width:37px; height:37px;
                border-radius:50%;
                object-fit:cover;
                margin:8px 12px 8px 10px;
                box-shadow: 0 2px 8px rgba(40,40,70,0.13);
                background:#f3f3fa;
                flex-shrink:0;
            "
            />
        </div>
        `

      const popup = new maplibregl.Popup({
        offset: 25,
        closeButton: false, // Không dấu X
        closeOnClick: true, // Click ra ngoài sẽ tự đóng popup!
      }).setHTML(popupHTML)

      const marker = new maplibregl.Marker(el)
        .setLngLat([shop.longitude, shop.latitude])
        .setPopup(popup)
        .addTo(mapRef.current!)

      markersRef.current.push(marker)
    })
  }, [shops, hoveredShopId])

  // Di chuyển đến focusedShop nếu có
  useEffect(() => {
    if (
      focusedShop &&
      focusedShop.latitude != null &&
      focusedShop.longitude != null &&
      mapRef.current
    ) {
      mapRef.current.flyTo({
        center: [focusedShop.longitude, focusedShop.latitude],
        zoom: 14,
        essential: true,
      })
    }
  }, [focusedShop])

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: '100%',
        height: '400px',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 24,
      }}
    />
  )
}
