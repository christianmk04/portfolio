import { useWindowStore } from '../../store/windowStore';
import type { AppId } from '../../store/windowStore';

interface Props {
  appId: AppId;
}

export default function TrafficLights({ appId }: Props) {
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);

  return (
    <div className="traffic-lights">
      <div
        className="traffic-light traffic-light-close"
        onClick={(e) => { e.stopPropagation(); closeWindow(appId); }}
        title="Close"
      >
        <span className="traffic-light-symbol">✕</span>
      </div>
      <div
        className="traffic-light traffic-light-min"
        onClick={(e) => { e.stopPropagation(); minimizeWindow(appId); }}
        title="Minimize"
      >
        <span className="traffic-light-symbol">−</span>
      </div>
      <div
        className="traffic-light traffic-light-max"
        onClick={(e) => e.stopPropagation()}
        title="Maximize"
      >
        <span className="traffic-light-symbol">+</span>
      </div>
    </div>
  );
}
