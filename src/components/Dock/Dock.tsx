import { useWindowStore } from '../../store/windowStore';
import type { AppId } from '../../store/windowStore';
import { APPS } from '../../data/content';
import DockIcon from './DockIcon';

export default function Dock() {
  const windows = useWindowStore((s) => s.windows);

  return (
    <div className="dock-container">
      {APPS.map((app) => (
        <DockIcon
          key={app.id}
          appId={app.id as AppId}
          icon={app.icon}
          label={app.label}
          isOpen={windows[app.id as AppId]?.isOpen ?? false}
        />
      ))}
    </div>
  );
}
