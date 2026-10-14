import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

// Fix Leaflet's default icon paths in bundler environments
delete ((L.Icon.Default.prototype as unknown) as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export interface MapMarker {
  id: string;
  coords: [number, number];
  title: string;
  subtitle?: string;
  category?: string;
  badge?: string;
}

interface LeafletMapProps {
  center: [number, number];
  zoom?: number;
  markers: MapMarker[];
  routes?: { from: [number, number]; to: [number, number]; label?: string }[];
  className?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  center,
  zoom = 13,
  markers,
  routes = [],
  className = 'h-72 w-full',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      // CartoDB Dark Matter / OpenStreetMap tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView(center, zoom);
    }

    return () => {
      // Clean up map when component unmounts
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers & routes whenever props change
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    layerGroupRef.current.clearLayers();

    // Custom campus icon
    const campusIcon = L.divIcon({
      className: 'custom-campus-pin',
      html: `<div style="background-color: #6366f1; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: bold;">🎓</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const routeIcon = L.divIcon({
      className: 'custom-route-pin',
      html: `<div style="background-color: #0284c7; width: 22px; height: 22px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-size: 11px;">🚗</div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });

    markers.forEach((m) => {
      const isCampus = m.title.toLowerCase().includes('campus') || m.title.toLowerCase().includes('vesit');
      const marker = L.marker(m.coords, {
        icon: isCampus ? campusIcon : routeIcon,
      });

      marker.bindPopup(`
        <div style="font-family: inherit; padding: 4px; color: #0f172a;">
          <strong style="font-size: 13px; display: block;">${m.title}</strong>
          ${m.subtitle ? `<span style="font-size: 11px; color: #64748b;">${m.subtitle}</span><br/>` : ''}
          ${m.badge ? `<span style="display: inline-block; margin-top: 4px; padding: 2px 6px; font-size: 10px; background: #e0e7ff; color: #4338ca; border-radius: 4px; font-weight: 600;">${m.badge}</span>` : ''}
        </div>
      `);

      layerGroupRef.current?.addLayer(marker);
    });

    // Draw route lines
    routes.forEach((r) => {
      const polyline = L.polyline([r.from, r.to], {
        color: '#6366f1',
        weight: 3,
        opacity: 0.8,
        dashArray: '6, 8',
      });
      if (r.label) {
        polyline.bindPopup(`<b>${r.label}</b>`);
      }
      layerGroupRef.current?.addLayer(polyline);
    });
  }, [markers, routes]);

  return <div ref={mapContainerRef} className={`rounded-xl overflow-hidden shadow-inner ${className}`} />;
};
