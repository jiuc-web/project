import { useContext, useState } from 'react';
import { SettingsContext } from '../../contexts/SettingsContext';

export default function UserProfileModal({ open, onClose, user, setUser }) {
  const { settings, setSettings } = useContext(SettingsContext);
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [signature, setSignature] = useState(user?.signature || '');
  const fontOptions = ['Arial', 'Verdana', 'Georgia', 'Courier New', 'Comic Sans MS'];

  if (!open) return null;

  const handleSave = () => {
    setUser(prev => ({
      ...prev,
      nickname,
      signature,
    }));
    setSettings({ ...settings, fontFamily: settings.fontFamily });
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>用户设置</h2>
        <div>
          <label>昵称：</label>
          <input value={nickname} onChange={e => setNickname(e.target.value)} />
        </div>
        <div>
          <label>个性签名：</label>
          <input value={signature} onChange={e => setSignature(e.target.value)} />
        </div>
        <div>
          <label>字体样式：</label>
          <select
            value={settings.fontFamily}
            onChange={e => setSettings({ ...settings, fontFamily: e.target.value })}
          >
            {fontOptions.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>
        <div style={{ marginTop: 16 }}>
          <button onClick={handleSave}>保存</button>
          <button onClick={onClose} style={{ marginLeft: 8 }}>取消</button>
        </div>
      </div>
    </div>
  );
}