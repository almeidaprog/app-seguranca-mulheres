import { useState, useEffect } from 'react'
import './App.css'
import securityLogo from './images/security.png';

/* eslint-disable no-unused-vars */

// Serviço API
const API_BASE_URL = 'http://localhost:5000/api/users';

const apiService = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      ...options,
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  },

  async register(userData) {
    return this.request('/register', { method: 'POST', body: userData });
  },

  async login(credentials) {
    return this.request('/login', { method: 'POST', body: credentials });
  },

  async logout() {
    return this.request('/logout', { method: 'POST' });
  },

  async getProfile() {
    return this.request('/profile');
  },

  async updateProfile(userData) {
    return this.request('/profile', { method: 'PUT', body: userData });
  },

  async deleteAccount() {
    return this.request('/account', { method: 'DELETE' });
  },

  async checkAuth() {
    return this.request('/check');
  }
};

// ÍCONES CORRETOS DO FIGMA
const HomeIcon = () => (
  <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LocationIcon = () => (
  <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PanicIcon = () => (
  <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5Z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CommunityIcon = () => (
  <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ReportIcon = () => (
  <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 12h.01M15 12h.01M10 16c.5.5 1.5.5 2 0 .5-.5 1.5-.5 2 0" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 20h6a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MapIcon = () => (
  <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 4v16m6-16v16M3 4l7 4 4-4 7 4V4l-7-4-4 4L3 4z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const NotificationIcon = () => (
  <svg className="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M10 5a2 2 0 1 1 4 0 7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2-3v-3a7 7 0 0 1 4-6z" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 17v1a3 3 0 0 0 6 0v-1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SettingsIcon = () => (
  <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LogoutIcon = () => (
  <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ÍCONES DOS CARDS
const WarningIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="9" x2="12" y2="13" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PeopleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// COMPONENTE PARA SELEÇÃO DE TEMA
const ThemeSelector = () => {
  const [theme, setTheme] = useState('light');

  const themes = [
    { id: 'light', label: 'Claro', icon: '☀️' },
    { id: 'dark', label: 'Escuro', icon: '🌙' },
    { id: 'auto', label: 'Automático', icon: '🔄' }
  ];

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
    document.documentElement.setAttribute('data-theme', selectedTheme);
    localStorage.setItem('theme', selectedTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <div className="theme-selector">
      <div className="theme-options">
        {themes.map((themeOption) => (
          <button
            key={themeOption.id}
            className={`theme-option ${theme === themeOption.id ? 'active' : ''}`}
            onClick={() => handleThemeChange(themeOption.id)}
          >
            <span className="theme-icon">{themeOption.icon}</span>
            <span className="theme-label">{themeOption.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// COMPONENTE PARA SELEÇÃO DE UNIDADES
const UnitSelector = () => {
  const [unit, setUnit] = useState('km');

  const units = [
    { id: 'km', label: 'km' },
    { id: 'mi', label: 'mi' }
  ];

  const handleUnitChange = (selectedUnit) => {
    setUnit(selectedUnit);
    localStorage.setItem('unit', selectedUnit);
  };

  useEffect(() => {
    const savedUnit = localStorage.getItem('unit') || 'km';
    setUnit(savedUnit);
  }, []);

  return (
    <div className="unit-selector">
      <div className="unit-options">
        {units.map((unitOption) => (
          <button
            key={unitOption.id}
            className={`unit-option ${unit === unitOption.id ? 'active' : ''}`}
            onClick={() => handleUnitChange(unitOption.id)}
          >
            {unitOption.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// COMPONENTE DO MODAL DE SAÍDA
const LogoutModal = ({ type, onClose, onConfirm }) => {
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState('');
  const [feedback, setFeedback] = useState('');

  const modalConfig = {
    session: {
      title: 'Sair da Conta',
      icon: '🚪',
      description: 'Tem certeza que deseja sair da sua conta?',
      confirmText: 'Sair da Conta',
      warning: 'Você precisará fazer login novamente para acessar recursos completos.',
      steps: 1
    },
    delete: {
      title: 'Excluir Conta Permanentemente',
      icon: '🗑️',
      description: 'Esta ação não pode ser desfeita. Todos os seus dados serão perdidos.',
      confirmText: 'Excluir Conta',
      warning: '⚠️ Esta ação é irreversível. Todos os seus dados serão permanentemente removidos.',
      steps: 2
    },
    anonymous: {
      title: 'Entrar como Anônima',
      icon: '🔒',
      description: 'Continuar usando o app sem estar logada?',
      confirmText: 'Continuar Anônima',
      warning: 'Algumas funcionalidades estarão limitadas.',
      steps: 1
    }
  };

  const config = modalConfig[type];

  const handleConfirm = () => {
    if (type === 'delete' && step === 1) {
      setStep(2);
    } else {
      onConfirm(type);
    }
  };

  const getStepContent = () => {
    if (type === 'delete' && step === 2) {
      return (
        <div className="delete-confirmation">
          <div className="warning-section">
            <div className="warning-icon">⚠️</div>
            <h4>Confirmação Final</h4>
            <p>Para confirmar a exclusão, digite <strong>EXCLUIR CONTA</strong> abaixo:</p>
            <input
              type="text"
              placeholder="Digite EXCLUIR CONTA"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="confirmation-input"
            />
          </div>
          
          <div className="feedback-section">
            <label>Nos conte o motivo (opcional):</label>
            <textarea
              placeholder="Por que você está excluindo sua conta?"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows="3"
              className="feedback-input"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="modal-content">
        <div className="modal-icon">{config.icon}</div>
        <h3>{config.title}</h3>
        <p>{config.description}</p>
        
        {config.warning && (
          <div className="warning-message">
            {config.warning}
          </div>
        )}

        {type === 'session' && (
          <div className="session-details">
            <h4>O que acontecerá:</h4>
            <ul>
              <li>✓ Sua sessão atual será encerrada</li>
              <li>✓ Todos os dados serão mantidos</li>
              <li>✓ Configurações salvas</li>
              <li>✓ Histórico preservado</li>
            </ul>
          </div>
        )}

        {type === 'anonymous' && (
          <div className="anonymous-info">
            <h4>Funcionalidades disponíveis:</h4>
            <div className="features-grid">
              <div className="feature available">
                <span>✓</span>
                <span>Mapa de risco</span>
              </div>
              <div className="feature available">
                <span>✓</span>
                <span>Botão do pânico</span>
              </div>
              <div className="feature limited">
                <span>ⓘ</span>
                <span>Comunidade (somente leitura)</span>
              </div>
              <div className="feature unavailable">
                <span>✗</span>
                <span>Denúncias anônimas</span>
              </div>
              <div className="feature unavailable">
                <span>✗</span>
                <span>Histórico pessoal</span>
              </div>
              <div className="feature unavailable">
                <span>✗</span>
                <span>Configurações salvas</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const isConfirmDisabled = type === 'delete' && step === 2 && reason !== 'EXCLUIR CONTA';

  return (
    <div className="modal-overlay">
      <div className="modal logout-modal">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        
        {getStepContent()}

        <div className="modal-actions">
          {type === 'delete' && step === 2 && (
            <button 
              className="secondary-button"
              onClick={() => setStep(1)}
            >
              ↩️ Voltar
            </button>
          )}
          
          <button 
            className="secondary-button"
            onClick={onClose}
          >
            Cancelar
          </button>
          
          <button 
            className={`logout-confirm-button ${type}`}
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
          >
            {isConfirmDisabled ? 'Digite a confirmação' : config.confirmText}
          </button>
        </div>

        {type === 'delete' && (
          <div className="security-notice">
            <p>💡 <strong>Dica de segurança:</strong> Ao excluir sua conta, certifique-se de que não há denúncias ou informações importantes que possam ser necessárias posteriormente.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// COMPONENTE DO BOTÃO DO PÂNICO EXPANDIDO
const PanicButtonExpanded = () => {
  const [showModal, setShowModal] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [locationSharing, setLocationSharing] = useState(false);
  const [options, setOptions] = useState({
    location: true,
    call: true,
    sms: true,
    audio: false
  });

  const handleSendAlert = () => {
    setAlertSent(true);
    setTimeout(() => {
      setShowModal(false);
      setAlertSent(false);
    }, 3000);
  };

  const handleStartSharing = () => {
    setLocationSharing(true);
  };

  const handleStopSharing = () => {
    setLocationSharing(false);
  };

  if (showModal && !alertSent) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <h2>🚨 Ajuda Rápida</h2>
          <div className="modal-section">
            <p>Ative alertas de emergência para seus contatos.</p>
            
            <div className="warning-box">
              <h4>⚠️ Atenção</h4>
              <p>Ao ativar, seus contatos de confiança serão notificados imediatamente.</p>
            </div>
            
            <div className="feature-section">
              <h4>📍 Compartilhar Localização em Tempo Real</h4>
              <p>Envie sua localização para pessoas de confiança.</p>
              
              {!locationSharing ? (
                <>
                  <div className="info-box">
                    <p>Sua localização será compartilhada em tempo real por até 8 horas ou até você desativar.</p>
                  </div>
                  
                  <div className="contacts-section">
                    <h5>Contatos de Confiança</h5>
                    <p>3 contatos configurados</p>
                  </div>
                  
                  <button className="secondary-button" onClick={handleStartSharing}>
                    Iniciar Compartilhamento
                  </button>
                </>
              ) : (
                <>
                  <div className="success-box">
                    <span className="success-icon">✓</span>
                    <span>Localização sendo compartilhada</span>
                  </div>
                  
                  <div className="link-box">
                    <h5>Link de Rastreamento</h5>
                    <p className="tracking-link">https://seguranca-feminina.com/track/abc123xyz</p>
                  </div>
                  
                  <div className="location-info">
                    <h5>Barro do Porto</h5>
                  </div>
                  
                  <button className="secondary-button" onClick={handleStopSharing}>
                    Parar Compartilhamento
                  </button>
                </>
              )}
            </div>

            <div className="options-section">
              <h4>O que será enviado:</h4>
              <label className="option-checkbox">
                <input
                  type="checkbox"
                  checked={options.location}
                  onChange={(e) => setOptions(prev => ({...prev, location: e.target.checked}))}
                />
                <span>📍 Localização em tempo real</span>
              </label>
              <label className="option-checkbox">
                <input
                  type="checkbox"
                  checked={options.call}
                  onChange={(e) => setOptions(prev => ({...prev, call: e.target.checked}))}
                />
                <span>📞 Ligação de emergência</span>
              </label>
              <label className="option-checkbox">
                <input
                  type="checkbox"
                  checked={options.sms}
                  onChange={(e) => setOptions(prev => ({...prev, sms: e.target.checked}))}
                />
                <span>💬 SMS de alerta</span>
              </label>
              <label className="option-checkbox">
                <input
                  type="checkbox"
                  checked={options.audio}
                  onChange={(e) => setOptions(prev => ({...prev, audio: e.target.checked}))}
                />
                <span>🎤 Análise de áudio</span>
              </label>
            </div>
            
            <div className="contacts-list">
              <h4>Contatos que serão notificados:</h4>
              <ul>
                <li>Contato 1: (11) 98765-4321</li>
                <li>Contato 2: (11) 91234-5678</li>
                <li>Contato 3: (11) 99876-5432</li>
              </ul>
            </div>
            
            <button className="emergency-button" onClick={handleSendAlert}>
              🚨 ATIVAR AJUDA RÁPIDA
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showModal && alertSent) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="success-modal">
            <div className="success-icon-large">✓</div>
            <h3>Alerta enviado com sucesso!</h3>
            <p>Seus contatos foram notificados.</p>
            <p className="success-details">
              📍 Localização compartilhada<br/>
              📞 Ligação de emergência acionada<br/>
              💬 SMS enviado para contatos
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card panic" onClick={() => setShowModal(true)}>
      <div className="card-icon">
        <WarningIcon />
      </div>
      <h3 className="card-title">Botão do Pânico</h3>
      <p className="card-desc">Acione em caso de emergência para alertar autoridades e contatos</p>
      <button className="panic-button" onClick={(e) => { e.stopPropagation(); setShowModal(true); }}>
        Acionar Emergência
      </button>
    </div>
  );
};

// 2. FÓRUM SEGURO
const SafeForum = () => {
  const [showModal, setShowModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const messages = [
    { id: 1, user: 'Anônima A', time: '10 min atrás', text: 'Obrigada por este espaço seguro. Me sinto acolhida aqui.' },
    { id: 2, user: 'Anônima B', time: '15 min atrás', text: 'Alguém sabe se há grupos de apoio presencial na zona sul?' },
    { id: 3, user: 'Anônima C', time: '12 min atrás', text: 'Sim! O CRAS da região oferece grupos às terças-feiras.' },
    { id: 4, user: 'Anônima D', time: '5 min atrás', text: 'Precisando conversar. Alguém disponível?' }
  ];

  if (showModal) {
    return (
      <div className="modal-overlay">
        <div className="modal forum-modal">
          <h2>Fórum Seguro</h2>
          <p className="forum-subtitle">Espaço anônimo para compartilhar e apoiar.</p>
          
          <div className="messages-container">
            {messages.map(message => (
              <div key={message.id} className="forum-message">
                <div className="message-header">
                  <span className="user-name">{message.user}</span>
                  <span className="message-time">{message.time}</span>
                </div>
                <p className="message-text">{message.text}</p>
              </div>
            ))}
          </div>
          
          <div className="message-input-container">
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="message-input"
            />
            <button className="send-button">Enviar</button>
          </div>
          
          <button className="close-button" onClick={() => setShowModal(false)}>
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card help" onClick={() => setShowModal(true)}>
      <div className="card-icon">
        <PeopleIcon />
      </div>
      <h3 className="card-title">Comunidade de Ajuda</h3>
      <p className="card-desc">Conecte-se com outras mulheres para apoio mútuo e segurança</p>
    </div>
  );
};

// 3. DENÚNCIA ANÔNIMA
const AnonymousReport = () => {
  const [showModal, setShowModal] = useState(false);
  const [report, setReport] = useState({
    type: '',
    location: '',
    description: '',
    urgency: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Denúncia enviada com sucesso! Sua identidade está protegida.');
    setShowModal(false);
    setReport({ type: '', location: '', description: '', urgency: '' });
  };

  if (showModal) {
    return (
      <div className="modal-overlay">
        <div className="modal report-modal">
          <h2>Denúncia Anônima</h2>
          <p className="report-subtitle">
            Sua identidade será protegida. Todas as informações são confidenciais.
          </p>
          <p className="report-info">
            Esta denúncia será enviada de forma anônima às autoridades competentes.
          </p>
          
          <form onSubmit={handleSubmit} className="report-form">
            <div className="form-group">
              <label>Tipo de Ocorrência</label>
              <select 
                value={report.type} 
                onChange={(e) => setReport(prev => ({...prev, type: e.target.value}))}
                required
              >
                <option value="">Selecione o tipo</option>
                <option value="assédio">Assédio</option>
                <option value="violência">Violência</option>
                <option value="discriminação">Discriminação</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Local da Ocorrência (opcional)</label>
              <input
                type="text"
                placeholder="Ex: Próximo ao mercado central, bairro..."
                value={report.location}
                onChange={(e) => setReport(prev => ({...prev, location: e.target.value}))}
              />
            </div>
            
            <div className="form-group">
              <label>Descrição da Ocorrência</label>
              <textarea
                placeholder="Descreva o que aconteceu com o máximo de detalhes possível..."
                value={report.description}
                onChange={(e) => setReport(prev => ({...prev, description: e.target.value}))}
                required
                rows="4"
              />
            </div>
            
            <div className="form-group">
              <label>Nível de Urgência</label>
              <select 
                value={report.urgency} 
                onChange={(e) => setReport(prev => ({...prev, urgency: e.target.value}))}
                required
              >
                <option value="">Selecione a urgência</option>
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="emergencia">Emergência</option>
              </select>
            </div>
            
            <button type="submit" className="submit-report-button">
              Enviar Denúncia Anônima
            </button>
          </form>
          
          <button className="close-button" onClick={() => setShowModal(false)}>
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="feature-card" onClick={() => setShowModal(true)}>
      <div className="feature-icon">🛡️</div>
      <h3>Denúncia Anônima</h3>
      <p>Faça denúncias de forma anônima e proteja outras mulheres</p>
    </div>
  );
};

// 4. ROTAS SEGURAS
const SafeRoutes = () => {
  const [showModal, setShowModal] = useState(false);
  const [destination, setDestination] = useState('');

  if (showModal) {
    return (
      <div className="modal-overlay">
        <div className="modal routes-modal">
          <h2>Minha Localização</h2>
          <div className="modal-section">
            <h3>Rotas Seguras</h3>
            <p>Encontre os caminhos mais seguros para o seu destino.</p>
            
            <div className="destination-input">
              <h4>Para onde você vai?</h4>
              <input
                type="text"
                placeholder="Digite o endereço de destino"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            
            {destination && (
              <div className="routes-display">
                <h4>Rotas Disponíveis:</h4>
                <div className="route-option">
                  <span className="route-dot" style={{background: '#10B981'}}></span>
                  <span>Rota Mais Segura - 15 min</span>
                </div>
                <div className="route-option">
                  <span className="route-dot" style={{background: '#F59E0B'}}></span>
                  <span>Rota Rápida - 12 min</span>
                </div>
                <div className="route-option">
                  <span className="route-dot" style={{background: '#EF4444'}}></span>
                  <span>Evitar - Área Pouco Movimentada</span>
                </div>
              </div>
            )}
            
            <div className="button-group">
              <button className="primary-button">
                Encontrar Rotas
              </button>
              <button className="text-button" onClick={() => setShowModal(false)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="feature-card" onClick={() => setShowModal(true)}>
      <div className="feature-icon">🗺️</div>
      <h3>Rotas Seguras</h3>
      <p>Encontre os caminhos mais seguros para seu destino</p>
    </div>
  );
};

// COMPONENTE PARA PÁGINAS QUE REQUEREM AUTENTICAÇÃO
const AuthRequired = ({ children, isAuthenticated, onShowAuth }) => {
  if (!isAuthenticated) {
    return (
      <div className="auth-required">
        <div className="auth-required-icon">🔐</div>
        <h2>Área Restrita</h2>
        <p className="auth-required-message">
          Faça login para acessar esta funcionalidade.
        </p>
        <button 
          className="primary-button"
          onClick={onShowAuth}
        >
          Fazer Login
        </button>
      </div>
    );
  }
  return children;
};

// COMPONENTE PRINCIPAL
export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [showLogoutModal, setShowLogoutModal] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authMessage, setAuthMessage] = useState('');

  // Estados para formulários de autenticação
  const [loginData, setLoginData] = useState({
    email: '',
    password_hash: ''
  });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password_hash: '',
    age: '',
    gender: '',
    phoneNumber: '',
    city: '',
    neighborhood: ''
  });

  // Verificar autenticação ao carregar
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const response = await apiService.checkAuth();
      if (response.isLoggedIn && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  // Funções de autenticação
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthMessage('');
    
    try {
      const response = await apiService.login(loginData);
      setUser(response.user);
      setIsAuthenticated(true);
      setShowAuthModal(false);
      setLoginData({ email: '', password_hash: '' });
      setAuthMessage('success::Login realizado com sucesso!');
    } catch (error) {
      setAuthMessage(`error::${error.message || 'Erro ao fazer login'}`);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthMessage('');
    
    try {
      const userData = {
        ...registerData,
        age: parseInt(registerData.age),
        address: registerData.city || registerData.neighborhood ? {
          city: registerData.city,
          neighborhood: registerData.neighborhood
        } : undefined
      };

      // Remove campos undefined
      Object.keys(userData).forEach(key => {
        if (userData[key] === '' || userData[key] === undefined) {
          delete userData[key];
        }
      });

      const response = await apiService.register(userData);
      setUser(response.user);
      setIsAuthenticated(true);
      setShowAuthModal(false);
      setRegisterData({
        name: '', email: '', password_hash: '', age: '', gender: '', 
        phoneNumber: '', city: '', neighborhood: ''
      });
      setAuthMessage('success::Conta criada com sucesso!');
    } catch (error) {
      setAuthMessage(`error::${error.message || 'Erro ao criar conta'}`);
    }
  };

  // Modificar a função handleLogout existente
  const handleLogout = async (type) => {
    setShowLogoutModal(null);
    
    if (type === 'session') {
      try {
        await apiService.logout();
        setUser(null);
        setIsAuthenticated(false);
        setAuthMessage('success::Logout realizado com sucesso!');
        setActivePage('home');
      } catch (error) {
        setAuthMessage('error::Erro ao fazer logout');
      }
    } else if (type === 'delete') {
      try {
        await apiService.deleteAccount();
        setUser(null);
        setIsAuthenticated(false);
        setAuthMessage('success::Conta excluída com sucesso!');
        setActivePage('home');
      } catch (error) {
        setAuthMessage('error::Erro ao excluir conta');
      }
    } else if (type === 'anonymous') {
      setAuthMessage('info::Modo anônimo ativado!');
      setActivePage('home');
    }
  };

  // Atualizar perfil
  const handleUpdateProfile = async (userData) => {
    try {
      const response = await apiService.updateProfile(userData);
      setUser(response.user);
      setAuthMessage('success::Perfil atualizado com sucesso!');
    } catch (error) {
      setAuthMessage(`error::${error.message || 'Erro ao atualizar perfil'}`);
    }
  };

  const menuItems = [
    { id: 'home', label: 'Página Inicial', icon: HomeIcon, requiresAuth: false },
    { id: 'location', label: 'Minha Localização', icon: LocationIcon, requiresAuth: false },
    { id: 'panic', label: 'Botão do Pânico', icon: PanicIcon, requiresAuth: false },
    { id: 'community', label: 'Comunidade de Ajuda', icon: CommunityIcon, requiresAuth: true },
    { id: 'reports', label: 'Denúncias', icon: ReportIcon, requiresAuth: true },
    { id: 'riskmap', label: 'Mapa de Risco', icon: MapIcon, requiresAuth: false },
    { id: 'notifications', label: 'Notificações', icon: NotificationIcon, requiresAuth: true },
    { id: 'settings', label: 'Configurações', icon: SettingsIcon, requiresAuth: true },
    { id: 'auth', label: isAuthenticated ? 'Sair' : 'Entrar', icon: LogoutIcon, requiresAuth: false },
  ];

  // Modificar a função de clique no menu
  const handleMenuClick = (item) => {
    if (item.id === 'auth') {
      if (isAuthenticated) {
        setShowLogoutModal('session');
      } else {
        setAuthMode('login');
        setShowAuthModal(true);
      }
    } else {
      if (item.requiresAuth && !isAuthenticated) {
        setAuthMode('login');
        setShowAuthModal(true);
      } else {
        setActivePage(item.id);
      }
    }
  };

  // Adicionar mensagem de autenticação no header se existir
  useEffect(() => {
    if (authMessage) {
      const timer = setTimeout(() => {
        setAuthMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [authMessage]);

  const renderPage = () => {
    if (authLoading) {
      return (
        <div className="auth-loading">
          <div className="auth-loading-spinner"></div>
          <span>Carregando...</span>
        </div>
      );
    }

    switch (activePage) {
      case 'home':
        return (
          <>
            <h1 className="page-title">Minha Localização</h1>
            <p className="page-subtitle">Saiba onde você está e encontre pontos de apoio próximos.</p>

            <div className="map-container">
              <div className="map-pin">
                <div className="map-pulse"></div>
              </div>
              <div className="map-overlay">
                <span>Visualização do mapa</span>
              </div>
            </div>

            <div className="cards-grid">
              <PanicButtonExpanded />
              <SafeForum />
            </div>

            <div className="features-grid">
              <AnonymousReport />
              <SafeRoutes />
            </div>
          </>
        );
      
      case 'location':
        return (
          <>
            <h1 className="page-title">Minha Localização</h1>
            <p className="page-subtitle">Visualize sua localização atual, encontre pontos de apoio próximos e gerencie o compartilhamento de localização.</p>

            <div className="location-page-content">
              <div className="location-status">
                <div className="status-card">
                  <div className="status-icon">📍</div>
                  <div className="status-info">
                    <h3>Localização Ativa</h3>
                    <p>Sua localização está sendo compartilhada com seus contatos de confiança</p>
                    <span className="status-badge active">Ativo</span>
                  </div>
                </div>
                
                <div className="status-actions">
                  <button className="secondary-button">
                    🔄 Atualizar Localização
                  </button>
                  <button className="text-button">
                    ⚙️ Configurações
                  </button>
                </div>
              </div>

              <div className="map-container-large">
                <div className="interactive-map">
                  <div className="map-overlay-large">
                    <div className="map-legend">
                      <h4>Legenda do Mapa</h4>
                      <div className="legend-items">
                        <div className="legend-item">
                          <span className="map-pin user"></span>
                          <span>Sua Localização</span>
                        </div>
                        <div className="legend-item">
                          <span className="map-pin police"></span>
                          <span>Delegacias</span>
                        </div>
                        <div className="legend-item">
                          <span className="map-pin hospital"></span>
                          <span>Hospitais</span>
                        </div>
                        <div className="legend-item">
                          <span className="map-pin support"></span>
                          <span>Pontos de Apoio</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="location-points">
                      <div className="user-location-point">
                        <div className="user-pin-large">
                          <div className="user-pulse-large"></div>
                        </div>
                        <div className="location-tooltip">
                          <strong>Você está aqui</strong>
                          <p>Rua das Flores, 123 - Centro</p>
                          <small>Atualizado há 2 min</small>
                        </div>
                      </div>
                      
                      <div className="support-point police" style={{top: '30%', left: '40%'}}>
                        <div className="support-tooltip">
                          <strong>Delegacia da Mulher</strong>
                          <p>24h - Atendimento especializado</p>
                          <small>📞 (11) 3333-4444</small>
                          <small>📍 0.8km de distância</small>
                        </div>
                      </div>
                      
                      <div className="support-point hospital" style={{top: '60%', left: '65%'}}>
                        <div className="support-tooltip">
                          <strong>Hospital Municipal</strong>
                          <p>Plantão 24h - Emergências</p>
                          <small>🚑 Ambulatório 24h</small>
                          <small>📍 1.2km de distância</small>
                        </div>
                      </div>
                      
                      <div className="support-point pharmacy" style={{top: '45%', left: '25%'}}>
                        <div className="support-tooltip">
                          <strong>Farmácia 24h</strong>
                          <p>Aberto 24 horas</p>
                          <small>💊 Medicamentos</small>
                          <small>📍 0.5km de distância</small>
                        </div>
                      </div>
                      
                      <div className="support-point metro" style={{top: '75%', left: '50%'}}>
                        <div className="support-tooltip">
                          <strong>Estação de Metrô</strong>
                          <p>Estação Central - Linha 1</p>
                          <small>🚇 Até 23h</small>
                          <small>📍 0.3km de distância</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="map-controls-panel">
                <div className="controls-row">
                  <h4>Controles do Mapa</h4>
                  <div className="control-buttons">
                    <button className="control-button">
                      📍 Centralizar
                    </button>
                    <button className="control-button">
                      🎯 Minha Localização
                    </button>
                    <button className="control-button">
                      📏 Medir Distância
                    </button>
                  </div>
                </div>
                
                <div className="controls-row">
                  <h4>Filtrar Pontos</h4>
                  <div className="filter-options">
                    <label className="filter-checkbox">
                      <input type="checkbox" defaultChecked />
                      <span>🏥 Hospitais</span>
                    </label>
                    <label className="filter-checkbox">
                      <input type="checkbox" defaultChecked />
                      <span>👮 Delegacias</span>
                    </label>
                    <label className="filter-checkbox">
                      <input type="checkbox" defaultChecked />
                      <span>💊 Farmácias</span>
                    </label>
                    <label className="filter-checkbox">
                      <input type="checkbox" defaultChecked />
                      <span>🚇 Transporte</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="nearby-places">
                <h3>Pontos de Apoio Próximos</h3>
                <div className="places-grid">
                  <div className="place-card">
                    <div className="place-icon">👮</div>
                    <div className="place-info">
                      <h4>Delegacia da Mulher</h4>
                      <p>Rua Central, 456</p>
                      <div className="place-meta">
                        <span className="distance">0.8km</span>
                        <span className="status open">24h</span>
                      </div>
                    </div>
                    <button className="action-button primary">
                      Ver Rota
                    </button>
                  </div>
                  
                  <div className="place-card">
                    <div className="place-icon">🏥</div>
                    <div className="place-info">
                      <h4>Hospital Municipal</h4>
                      <p>Av. Principal, 789</p>
                      <div className="place-meta">
                        <span className="distance">1.2km</span>
                        <span className="status open">24h</span>
                      </div>
                    </div>
                    <button className="action-button primary">
                      Ver Rota
                    </button>
                  </div>
                  
                  <div className="place-card">
                    <div className="place-icon">💊</div>
                    <div className="place-info">
                      <h4>Farmácia 24h</h4>
                      <p>Rua das Flores, 321</p>
                      <div className="place-meta">
                        <span className="distance">0.5km</span>
                        <span className="status open">24h</span>
                      </div>
                    </div>
                    <button className="action-button primary">
                      Ver Rota
                    </button>
                  </div>
                  
                  <div className="place-card">
                    <div className="place-icon">🚇</div>
                    <div className="place-info">
                      <h4>Estação Central</h4>
                      <p>Praça da Matriz</p>
                      <div className="place-meta">
                        <span className="distance">0.3km</span>
                        <span className="status closed">Fecha 23h</span>
                      </div>
                    </div>
                    <button className="action-button primary">
                      Ver Rota
                    </button>
                  </div>
                </div>
              </div>

              <div className="sharing-section">
                <h3>Compartilhamento de Localização</h3>
                <div className="sharing-cards">
                  <div className="sharing-card">
                    <div className="sharing-header">
                      <div className="sharing-icon">👥</div>
                      <div className="sharing-info">
                        <h4>Compartilhamento Ativo</h4>
                        <p>3 contatos podem ver sua localização</p>
                      </div>
                      <span className="sharing-status active">Ativo</span>
                    </div>
                    
                    <div className="sharing-contacts">
                      <div className="contact-item">
                        <span className="contact-name">Maria Silva</span>
                        <span className="contact-phone">(11) 98765-4321</span>
                        <span className="contact-status online">Online</span>
                      </div>
                      <div className="contact-item">
                        <span className="contact-name">João Santos</span>
                        <span className="contact-phone">(11) 91234-5678</span>
                        <span className="contact-status online">Online</span>
                      </div>
                      <div className="contact-item">
                        <span className="contact-name">Ana Oliveira</span>
                        <span className="contact-phone">(11) 99876-5432</span>
                        <span className="contact-status away">Ausente</span>
                      </div>
                    </div>
                    
                    <div className="sharing-actions">
                      <button className="secondary-button">
                        👤 Gerenciar Contatos
                      </button>
                      <button className="text-button danger">
                        🛑 Parar Compartilhamento
                      </button>
                    </div>
                  </div>
                  
                  <div className="sharing-card">
                    <div className="sharing-header">
                      <div className="sharing-icon">⏰</div>
                      <div className="sharing-info">
                        <h4>Compartilhamento Temporário</h4>
                        <p>Compartilhe sua localização por um período específico</p>
                      </div>
                    </div>
                    
                    <div className="temporary-sharing">
                      <div className="time-options">
                        <button className="time-option">15 min</button>
                        <button className="time-option">1 hora</button>
                        <button className="time-option">8 horas</button>
                        <button className="time-option">24 horas</button>
                      </div>
                      
                      <div className="custom-time">
                        <label>Tempo personalizado:</label>
                        <div className="time-inputs">
                          <input type="number" placeholder="Horas" min="0" />
                          <span>:</span>
                          <input type="number" placeholder="Minutos" min="0" max="59" />
                        </div>
                      </div>
                      
                      <button className="primary-button">
                        ▶️ Iniciar Compartilhamento
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="location-history">
                <h3>Histórico de Localização</h3>
                <div className="history-timeline">
                  <div className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h5>Casa</h5>
                      <p>Rua das Flores, 123 - Centro</p>
                      <span className="timeline-time">Hoje - 08:30</span>
                    </div>
                  </div>
                  
                  <div className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h5>Trabalho</h5>
                      <p>Av. Paulista, 1000 - Bela Vista</p>
                      <span className="timeline-time">Hoje - 09:15</span>
                    </div>
                  </div>
                  
                  <div className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h5>Shopping Center</h5>
                      <p>Centro Comercial - Jardins</p>
                      <span className="timeline-time">Hoje - 12:45</span>
                    </div>
                  </div>
                  
                  <div className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h5>Parque Municipal</h5>
                      <p>Parque da Cidade - Zona Sul</p>
                      <span className="timeline-time">Hoje - 15:20</span>
                    </div>
                  </div>
                </div>
                
                <button className="text-button">
                  📊 Ver Histórico Completo
                </button>
              </div>

              <div className="privacy-settings">
                <h3>Configurações de Privacidade</h3>
                <div className="privacy-options">
                  <label className="privacy-checkbox">
                    <input type="checkbox" defaultChecked />
                    <span>Compartilhar localização com contatos de confiança</span>
                  </label>
                  
                  <label className="privacy-checkbox">
                    <input type="checkbox" defaultChecked />
                    <span>Atualização automática de localização</span>
                  </label>
                  
                  <label className="privacy-checkbox">
                    <input type="checkbox" />
                    <span>Compartilhar localização em modo de economia de bateria</span>
                  </label>
                  
                  <label className="privacy-checkbox">
                    <input type="checkbox" defaultChecked />
                    <span>Notificar quando chegar em locais importantes</span>
                  </label>
                  
                  <label className="privacy-checkbox">
                    <input type="checkbox" />
                    <span>Manter histórico de localização</span>
                  </label>
                </div>
              </div>
            </div>
          </>
        );
      
      case 'panic':
        return (
          <>
            <h1 className="page-title">Botão do Pânico</h1>
            <p className="page-subtitle">Acione em caso de emergência para alertar autoridades e contatos de confiança.</p>
            
            <div className="panic-page-content">
              <PanicButtonExpanded />
              
              <div className="panic-info-section">
                <div className="info-card">
                  <h3>Como funciona?</h3>
                  <ul>
                    <li>📞 Notifica seus contatos de emergência</li>
                    <li>📍 Compartilha sua localização em tempo real</li>
                    <li>🚨 Aciona autoridades quando necessário</li>
                    <li>🔒 Mantém você conectada com sua rede de apoio</li>
                  </ul>
                </div>
                
                <div className="info-card">
                  <h3>Contatos de Emergência</h3>
                  <div className="contacts-list">
                    <div className="contact-item">
                      <span>👩‍💼 Maria Silva</span>
                      <span>(11) 98765-4321</span>
                    </div>
                    <div className="contact-item">
                      <span>👨‍⚕️ João Santos</span>
                      <span>(11) 91234-5678</span>
                    </div>
                    <div className="contact-item">
                      <span>🏥 Hospital Regional</span>
                      <span>190</span>
                    </div>
                  </div>
                  <button className="secondary-button">
                    Gerenciar Contatos
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      
      case 'community':
        return (
          <AuthRequired 
            isAuthenticated={isAuthenticated}
            onShowAuth={() => {
              setAuthMode('login');
              setShowAuthModal(true);
            }}
          >
            <>
              <h1 className="page-title">Comunidade de Ajuda</h1>
              <p className="page-subtitle">Conecte-se com outras mulheres para apoio mútuo e segurança em um espaço seguro.</p>
              
              <div className="community-page-content">
                <div className="community-stats">
                  <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                      <h3>1.247</h3>
                      <p>Mulheres na comunidade</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">💬</div>
                    <div className="stat-info">
                      <h3>568</h3>
                      <p>Mensagens hoje</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🤝</div>
                    <div className="stat-info">
                      <h3>89%</h3>
                      <p>Sentem-se mais seguras</p>
                    </div>
                  </div>
                </div>

                <div className="community-main">
                  <div className="community-features">
                    <SafeForum />
                    
                    <div className="community-resources">
                      <h3>Recursos de Apoio</h3>
                      <div className="resource-grid">
                        <div className="resource-card">
                          <div className="resource-icon">🩺</div>
                          <h4>Apoio Psicológico</h4>
                          <p>Profissionais especializados disponíveis 24/7</p>
                          <button className="secondary-button">Acessar</button>
                        </div>
                        <div className="resource-card">
                          <div className="resource-icon">⚖️</div>
                          <h4>Orientação Jurídica</h4>
                          <p>Advogadas voluntárias para orientação legal</p>
                          <button className="secondary-button">Consultar</button>
                        </div>
                        <div className="resource-card">
                          <div className="resource-icon">🏠</div>
                          <h4>Abrigos Parceiros</h4>
                          <p>Rede de abrigos seguros em situações de risco</p>
                          <button className="secondary-button">Localizar</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="community-sidebar">
                    <div className="sidebar-card">
                      <h4>📋 Regras da Comunidade</h4>
                      <ul>
                        <li>Respeito acima de tudo</li>
                        <li>Sigilo e anonimato</li>
                        <li>Sem julgamentos</li>
                        <li>Apoio mútuo</li>
                        <li>Denuncie comportamentos inadequados</li>
                      </ul>
                    </div>

                    <div className="sidebar-card">
                      <h4>🏆 Top Apoiadoras</h4>
                      <div className="top-supporters">
                        <div className="supporter">
                          <span>Anônima A</span>
                          <span>🌟 124</span>
                        </div>
                        <div className="supporter">
                          <span>Anônima B</span>
                          <span>🌟 98</span>
                        </div>
                        <div className="supporter">
                          <span>Anônima C</span>
                          <span>🌟 76</span>
                        </div>
                      </div>
                    </div>

                    <div className="sidebar-card">
                      <h4>🚨 Ajuda Imediata</h4>
                      <p>Precisa de ajuda urgente?</p>
                      <button className="emergency-button-small">
                        Buscar Apoio Imediato
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          </AuthRequired>
        );
      
      case 'reports':
        return (
          <AuthRequired 
            isAuthenticated={isAuthenticated}
            onShowAuth={() => {
              setAuthMode('login');
              setShowAuthModal(true);
            }}
          >
            <>
              <h1 className="page-title">Denúncias</h1>
              <p className="page-subtitle">Faça denúncias de forma anônima e segura. Sua identidade está protegida.</p>
              
              <div className="reports-page-content">
                <div className="reports-stats">
                  <div className="stat-card">
                    <div className="stat-icon">🛡️</div>
                    <div className="stat-info">
                      <h3>2.847</h3>
                      <p>Denúncias realizadas</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-info">
                      <h3>1.923</h3>
                      <p>Encaminhadas às autoridades</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">⚖️</div>
                    <div className="stat-info">
                      <h3>76%</h3>
                      <p>Em processamento</p>
                    </div>
                  </div>
                </div>

                <div className="reports-main">
                  <div className="reports-features">
                    <div className="feature-section">
                      <h2>Fazer Nova Denúncia</h2>
                      <p>Nosso sistema garante total anonimato e segurança das suas informações.</p>
                      <AnonymousReport />
                    </div>

                    <div className="reports-types">
                      <h3>Tipos de Denúncia</h3>
                      <div className="types-grid">
                        <div className="type-card">
                          <div className="type-icon">🚫</div>
                          <h4>Assédio Sexual</h4>
                          <p>Comportamentos indesejados de natureza sexual</p>
                        </div>
                        <div className="type-card">
                          <div className="type-icon">👊</div>
                          <h4>Violência Física</h4>
                          <p>Agressões, ameaças ou qualquer tipo de violência</p>
                        </div>
                        <div className="type-card">
                          <div className="type-icon">💬</div>
                          <h4>Assédio Moral</h4>
                          <p>Humilhação, constrangimento ou perseguição</p>
                        </div>
                        <div className="type-card">
                          <div className="type-icon">🚷</div>
                          <h4>Discriminação</h4>
                          <p>Preconceito por gênero, raça, orientação sexual</p>
                        </div>
                        <div className="type-card">
                          <div className="type-icon">📱</div>
                          <h4>Assédio Virtual</h4>
                          <p>Perseguição ou ameaças em ambiente digital</p>
                        </div>
                        <div className="type-card">
                          <div className="type-icon">🔍</div>
                          <h4>Outras Situações</h4>
                          <p>Qualquer outra forma de violência ou assédio</p>
                        </div>
                      </div>
                    </div>

                    <div className="reports-process">
                      <h3>Como Funciona o Processo</h3>
                      <div className="process-steps">
                        <div className="process-step">
                          <div className="step-number">1</div>
                          <div className="step-content">
                            <h4>Denúncia Anônima</h4>
                            <p>Você faz a denúncia sem identificar-se. Seus dados pessoais são protegidos.</p>
                          </div>
                        </div>
                        <div className="process-step">
                          <div className="step-number">2</div>
                          <div className="step-content">
                            <h4>Análise da Equipe</h4>
                            <p>Nossa equipe especializada analisa e categoriza a denúncia.</p>
                          </div>
                        </div>
                        <div className="process-step">
                          <div className="step-number">3</div>
                          <div className="step-content">
                            <h4>Encaminhamento</h4>
                            <p>A denúncia é encaminhada para as autoridades competentes.</p>
                          </div>
                        </div>
                        <div className="process-step">
                          <div className="step-number">4</div>
                          <div className="step-content">
                            <h4>Acompanhamento</h4>
                            <p>Monitoramos o andamento junto aos órgãos responsáveis.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="reports-sidebar">
                    <div className="sidebar-card">
                      <h4>📞 Canais de Apoio</h4>
                      <div className="support-channels">
                        <div className="channel">
                          <strong>Disque 180</strong>
                          <span>Central de Atendimento à Mulher</span>
                        </div>
                        <div className="channel">
                          <strong>Disque 100</strong>
                          <span>Direitos Humanos</span>
                        </div>
                        <div className="channel">
                          <strong>190</strong>
                          <span>Polícia Militar</span>
                        </div>
                        <div className="channel">
                          <strong>Disque 181</strong>
                          <span>Denúncia Anônima Estadual</span>
                        </div>
                      </div>
                    </div>

                    <div className="sidebar-card">
                      <h4>🛡️ Seus Direitos</h4>
                      <ul>
                        <li>Lei Maria da Penha (Lei 11.340/2006)</li>
                        <li>Lei do Feminicídio (Lei 13.104/2015)</li>
                        <li>Lei do Assédio Sexual (Lei 10.224/2001)</li>
                        <li>Direito ao anonimato</li>
                        <li>Proteção contra retaliação</li>
                      </ul>
                    </div>

                    <div className="sidebar-card">
                      <h4>📊 Denúncias Recentes</h4>
                      <div className="recent-reports">
                        <div className="report-item">
                          <span className="report-type">Assédio</span>
                          <span className="report-time">15 min atrás</span>
                        </div>
                        <div className="report-item">
                          <span className="report-type">Violência</span>
                          <span className="report-time">1 hora atrás</span>
                        </div>
                        <div className="report-item">
                          <span className="report-type">Discriminação</span>
                          <span className="report-time">2 horas atrás</span>
                        </div>
                      </div>
                      <p className="reports-note">+47 denúncias hoje</p>
                    </div>

                    <div className="sidebar-card emergency-card">
                      <h4>🚨 Emergência?</h4>
                      <p>Se você está em perigo imediato:</p>
                      <button className="emergency-button-small">
                        Ligue para 190
                      </button>
                      <button className="secondary-button">
                        Acionar Botão do Pânico
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          </AuthRequired>
        );
      
      case 'riskmap':
        return (
          <>
            <h1 className="page-title">Mapa de Risco</h1>
            <p className="page-subtitle">Visualize áreas de risco e encontre rotas seguras na sua cidade.</p>
            
            <div className="riskmap-page-content">
              <div className="map-controls">
                <div className="controls-header">
                  <h3>Filtros do Mapa</h3>
                  <div className="last-update">
                    <span className="update-badge">🔄</span>
                    Atualizado há 15 min
                  </div>
                </div>
                
                <div className="filters-grid">
                  <div className="filter-group">
                    <h4>Tipos de Risco</h4>
                    <div className="filter-options">
                      <label className="filter-checkbox">
                        <input type="checkbox" defaultChecked />
                        <span className="risk-dot high-risk"></span>
                        <span>Alto Risco</span>
                      </label>
                      <label className="filter-checkbox">
                        <input type="checkbox" defaultChecked />
                        <span className="risk-dot medium-risk"></span>
                        <span>Médio Risco</span>
                      </label>
                      <label className="filter-checkbox">
                        <input type="checkbox" defaultChecked />
                        <span className="risk-dot low-risk"></span>
                        <span>Baixo Risco</span>
                      </label>
                      <label className="filter-checkbox">
                        <input type="checkbox" defaultChecked />
                        <span className="risk-dot safe-zone"></span>
                        <span>Zonas Seguras</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="filter-group">
                    <h4>Tipos de Ocorrência</h4>
                    <div className="filter-options">
                      <label className="filter-checkbox">
                        <input type="checkbox" defaultChecked />
                        <span>🚫 Assédio</span>
                      </label>
                      <label className="filter-checkbox">
                        <input type="checkbox" defaultChecked />
                        <span>👊 Violência</span>
                      </label>
                      <label className="filter-checkbox">
                        <input type="checkbox" defaultChecked />
                        <span>💬 Assédio Moral</span>
                      </label>
                      <label className="filter-checkbox">
                        <input type="checkbox" defaultChecked />
                        <span>🚷 Discriminação</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="filter-group">
                    <h4>Período</h4>
                    <div className="time-filters">
                      <button className="time-filter active">24h</button>
                      <button className="time-filter">7 dias</button>
                      <button className="time-filter">30 dias</button>
                      <button className="time-filter">3 meses</button>
                    </div>
                  </div>
                </div>
                
                <div className="map-actions">
                  <button className="primary-button">
                    📍 Minha Localização
                  </button>
                  <button className="secondary-button">
                    🚨 Reportar Área
                  </button>
                </div>
              </div>

              <div className="map-container-large">
                <div className="interactive-map">
                  <div className="map-overlay-large">
                    <div className="map-legend">
                      <h4>Legenda do Mapa</h4>
                      <div className="legend-items">
                        <div className="legend-item">
                          <span className="risk-dot high-risk"></span>
                          <span>Alto Risco</span>
                        </div>
                        <div className="legend-item">
                          <span className="risk-dot medium-risk"></span>
                          <span>Médio Risco</span>
                        </div>
                        <div className="legend-item">
                          <span className="risk-dot low-risk"></span>
                          <span>Baixo Risco</span>
                        </div>
                        <div className="legend-item">
                          <span className="risk-dot safe-zone"></span>
                          <span>Zona Segura</span>
                        </div>
                        <div className="legend-item">
                          <span className="map-pin emergency"></span>
                          <span>Posto Policial</span>
                        </div>
                        <div className="legend-item">
                          <span className="map-pin support"></span>
                          <span>Ponto de Apoio</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="risk-points">
                      <div className="risk-point high-risk" style={{top: '30%', left: '25%'}}>
                        <div className="risk-tooltip">
                          <strong>Alto Risco</strong>
                          <p>Rua das Flores - 12 ocorrências</p>
                          <small>Assédio, Violência</small>
                        </div>
                      </div>
                      <div className="risk-point medium-risk" style={{top: '45%', left: '60%'}}>
                        <div className="risk-tooltip">
                          <strong>Médio Risco</strong>
                          <p>Praça Central - 5 ocorrências</p>
                          <small>Assédio Moral</small>
                        </div>
                      </div>
                      <div className="risk-point low-risk" style={{top: '65%', left: '40%'}}>
                        <div className="risk-tooltip">
                          <strong>Baixo Risco</strong>
                          <p>Avenida Principal - 2 ocorrências</p>
                          <small>Discriminação</small>
                        </div>
                      </div>
                      <div className="safe-zone-point" style={{top: '20%', left: '70%'}}>
                        <div className="safe-tooltip">
                          <strong>Zona Segura</strong>
                          <p>Shopping Center - Área monitorada</p>
                          <small>Segurança 24h</small>
                        </div>
                      </div>
                      
                      <div className="support-point police" style={{top: '55%', left: '30%'}}>
                        <div className="support-tooltip">
                          <strong>Delegacia da Mulher</strong>
                          <p>24h - Atendimento especializado</p>
                          <small>📞 (11) 3333-4444</small>
                        </div>
                      </div>
                      <div className="support-point hospital" style={{top: '35%', left: '50%'}}>
                        <div className="support-tooltip">
                          <strong>Hospital Municipal</strong>
                          <p>Plantão 24h - Ambulatório</p>
                          <small>🚑 Emergências</small>
                        </div>
                      </div>
                    </div>
                    
                    <div className="user-location">
                      <div className="user-pin">
                        <div className="user-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="risk-stats">
                <div className="stats-grid">
                  <div className="stat-card risk-stat">
                    <div className="stat-icon">🔴</div>
                    <div className="stat-info">
                      <h3>24</h3>
                      <p>Áreas de Alto Risco</p>
                    </div>
                  </div>
                  <div className="stat-card risk-stat">
                    <div className="stat-icon">🟡</div>
                    <div className="stat-info">
                      <h3>47</h3>
                      <p>Áreas de Médio Risco</p>
                    </div>
                  </div>
                  <div className="stat-card risk-stat">
                    <div className="stat-icon">🟢</div>
                    <div className="stat-info">
                      <h3>89</h3>
                      <p>Áreas de Baixo Risco</p>
                    </div>
                  </div>
                  <div className="stat-card risk-stat">
                    <div className="stat-icon">🏪</div>
                    <div className="stat-info">
                      <h3>156</h3>
                      <p>Pontos de Apoio</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="risk-areas">
                <h3>Áreas de Risco Identificadas</h3>
                <div className="areas-list">
                  <div className="area-item high-risk">
                    <div className="area-header">
                      <span className="area-risk-level">Alto Risco</span>
                      <span className="area-reports">12 ocorrências</span>
                    </div>
                    <h4>Rua das Flores - Centro</h4>
                    <p>Área com histórico de assédio e violência, especialmente no período noturno.</p>
                    <div className="area-tags">
                      <span className="tag">Assédio</span>
                      <span className="tag">Violência</span>
                      <span className="tag">Pouca iluminação</span>
                    </div>
                    <div className="area-actions">
                      <button className="text-button">Ver detalhes</button>
                      <button className="secondary-button">Reportar</button>
                    </div>
                  </div>
                  
                  <div className="area-item medium-risk">
                    <div className="area-header">
                      <span className="area-risk-level">Médio Risco</span>
                      <span className="area-reports">5 ocorrências</span>
                    </div>
                    <h4>Praça Central - Jardins</h4>
                    <p>Local movimentado com casos isolados de assédio moral durante o dia.</p>
                    <div className="area-tags">
                      <span className="tag">Assédio Moral</span>
                      <span className="tag">Discriminação</span>
                    </div>
                    <div className="area-actions">
                      <button className="text-button">Ver detalhes</button>
                      <button className="secondary-button">Reportar</button>
                    </div>
                  </div>
                  
                  <div className="area-item low-risk">
                    <div className="area-header">
                      <span className="area-risk-level">Baixo Risco</span>
                      <span className="area-reports">2 ocorrências</span>
                    </div>
                    <h4>Avenida Principal - Centro</h4>
                    <p>Área bem iluminada e movimentada, com baixo índice de ocorrências.</p>
                    <div className="area-tags">
                      <span className="tag">Seguro</span>
                      <span className="tag">Bem iluminado</span>
                    </div>
                    <div className="area-actions">
                      <button className="text-button">Ver detalhes</button>
                      <button className="secondary-button">Reportar</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="safety-tips">
                <h3>Dicas de Segurança</h3>
                <div className="tips-grid">
                  <div className="tip-card">
                    <div className="tip-icon">🌙</div>
                    <h4>À Noite</h4>
                    <ul>
                      <li>Evite áreas pouco iluminadas</li>
                      <li>Ande sempre em grupo</li>
                      <li>Use rotas principais</li>
                    </ul>
                  </div>
                  <div className="tip-card">
                    <div className="tip-icon">📱</div>
                    <h4>Prevenção</h4>
                    <ul>
                      <li>Compartilhe sua localização</li>
                      <li>Tenha contatos de emergência</li>
                      <li>Use o botão do pânico</li>
                    </ul>
                  </div>
                  <div className="tip-card">
                    <div className="tip-icon">🚶‍♀️</div>
                    <h4>No Transporte</h4>
                    <ul>
                      <li>Sentar perto do motorista</li>
                      <li>Evitar horários de pico</li>
                      <li>Verificar antes de entrar</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      
      case 'notifications':
        return (
          <AuthRequired 
            isAuthenticated={isAuthenticated}
            onShowAuth={() => {
              setAuthMode('login');
              setShowAuthModal(true);
            }}
          >
            <>
              <h1 className="page-title">Notificações</h1>
              <p className="page-subtitle">Mantenha-se informada sobre alertas de segurança e atualizações importantes.</p>
              
              <div className="notifications-page-content">
                <div className="notifications-header">
                  <div className="notifications-stats">
                    <div className="stat-badge">
                      <span className="stat-number">12</span>
                      <span className="stat-label">Novas</span>
                    </div>
                    <div className="stat-badge">
                      <span className="stat-number">47</span>
                      <span className="stat-label">Total</span>
                    </div>
                  </div>
                  
                  <div className="notifications-actions">
                    <button className="secondary-button">
                      📥 Marcar todas como lidas
                    </button>
                    <button className="text-button">
                      ⚙️ Configurações
                    </button>
                  </div>
                </div>

                <div className="notifications-filters">
                  <div className="filter-tabs">
                    <button className="filter-tab active">Todas</button>
                    <button className="filter-tab">Alertas</button>
                    <button className="filter-tab">Segurança</button>
                    <button className="filter-tab">Comunidade</button>
                    <button className="filter-tab">Sistema</button>
                  </div>
                  
                  <div className="filter-options">
                    <select className="filter-select">
                      <option>Ordenar por: Mais recentes</option>
                      <option>Ordenar por: Mais antigas</option>
                      <option>Ordenar por: Prioridade</option>
                    </select>
                  </div>
                </div>

                <div className="notifications-list">
                  <div className="notification-item critical">
                    <div className="notification-icon">🚨</div>
                    <div className="notification-content">
                      <div className="notification-header">
                        <h4>Alerta de Segurança - Área de Risco</h4>
                        <span className="notification-time">Agora há pouco</span>
                      </div>
                      <p className="notification-message">
                        Alto índice de ocorrências reportadas na região do Centro. Evite a Rua das Flores após às 18h.
                      </p>
                      <div className="notification-actions">
                        <button className="action-button primary">Ver no Mapa</button>
                        <button className="action-button">Ignorar</button>
                      </div>
                    </div>
                    <div className="notification-badge new"></div>
                  </div>

                  <div className="notification-item important">
                    <div className="notification-icon">🛡️</div>
                    <div className="notification-content">
                      <div className="notification-header">
                        <h4>Denúncia Encaminhada</h4>
                        <span className="notification-time">15 min atrás</span>
                      </div>
                      <p className="notification-message">
                        Sua denúncia #2847 foi encaminhada para a Delegacia da Mulher e está em processamento.
                      </p>
                      <div className="notification-meta">
                        <span className="meta-item">📋 Protocolo: #2847</span>
                        <span className="meta-item">⚖️ Status: Em análise</span>
                      </div>
                    </div>
                    <div className="notification-badge new"></div>
                  </div>

                  <div className="notification-item community">
                    <div className="notification-icon">👥</div>
                    <div className="notification-content">
                      <div className="notification-header">
                        <h4>Nova Mensagem na Comunidade</h4>
                        <span className="notification-time">1 hora atrás</span>
                      </div>
                      <p className="notification-message">
                        <strong>Anônima23</strong> compartilhou uma experiência e está buscando apoio.
                      </p>
                      <div className="notification-actions">
                        <button className="action-button primary">Ver Conversa</button>
                        <button className="action-button">Responder</button>
                      </div>
                    </div>
                    <div className="notification-badge new"></div>
                  </div>

                  <div className="notification-item info">
                    <div className="notification-icon">🏥</div>
                    <div className="notification-content">
                      <div className="notification-header">
                        <h4>Ponto de Apoio Próximo</h4>
                        <span className="notification-time">2 horas atrás</span>
                      </div>
                      <p className="notification-message">
                        Você está próxima ao Hospital Municipal - plantão 24h disponível.
                      </p>
                      <div className="notification-meta">
                        <span className="meta-item">📍 1.2km de distância</span>
                        <span className="meta-item">📞 (11) 3333-4444</span>
                      </div>
                    </div>
                  </div>

                  <div className="notification-item system">
                    <div className="notification-icon">🔄</div>
                    <div className="notification-content">
                      <div className="notification-header">
                        <h4>Mapa de Risco Atualizado</h4>
                        <span className="notification-time">5 horas atrás</span>
                      </div>
                      <p className="notification-message">
                        Novas áreas de risco foram identificadas na sua região. Verifique as rotas seguras atualizadas.
                      </p>
                      <div className="notification-actions">
                        <button className="action-button primary">Ver Mapa</button>
                      </div>
                    </div>
                  </div>

                  <div className="notification-item tip">
                    <div className="notification-icon">💡</div>
                    <div className="notification-content">
                      <div className="notification-header">
                        <h4>Dica de Segurança</h4>
                        <span className="notification-time">Ontem</span>
                      </div>
                      <p className="notification-message">
                        Ao usar transporte por aplicativo, verifique sempre a placa e modelo do veículo antes de entrar.
                      </p>
                      <div className="notification-meta">
                        <span className="meta-item">📱 Compartilhe com amigas</span>
                      </div>
                    </div>
                  </div>

                  <div className="notification-item event">
                    <div className="notification-icon">📅</div>
                    <div className="notification-content">
                      <div className="notification-header">
                        <h4>Workshop de Autodefesa</h4>
                        <span className="notification-time">2 dias atrás</span>
                      </div>
                      <p className="notification-message">
                        Participe do workshop gratuito de autodefesa para mulheres neste sábado, às 14h no Centro Comunitário.
                      </p>
                      <div className="notification-meta">
                        <span className="meta-item">📍 Centro Comunitário - Jardins</span>
                        <span className="meta-item">⏰ Sábado - 14h</span>
                      </div>
                      <div className="notification-actions">
                        <button className="action-button primary">Confirmar Presença</button>
                        <button className="action-button">Compartilhar</button>
                      </div>
                    </div>
                  </div>

                  <div className="notification-item system">
                    <div className="notification-icon">📊</div>
                    <div className="notification-content">
                      <div className="notification-header">
                        <h4>Relatório Semanal de Segurança</h4>
                        <span className="notification-time">3 dias atrás</span>
                      </div>
                      <p className="notification-message">
                        Sua região teve uma redução de 15% em ocorrências esta semana. Continue seguindo as rotas seguras!
                      </p>
                      <div className="notification-meta">
                        <span className="meta-item">📈 Tendência: Melhorando</span>
                        <span className="meta-item">🛡️ 89% de segurança</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="notifications-sidebar">
                  <div className="sidebar-card">
                    <h4>📋 Tipos de Notificação</h4>
                    <div className="notification-types">
                      <div className="type-item">
                        <span className="type-dot critical"></span>
                        <span>Alertas Críticos</span>
                        <span className="type-count">3</span>
                      </div>
                      <div className="type-item">
                        <span className="type-dot important"></span>
                        <span>Importantes</span>
                        <span className="type-count">5</span>
                      </div>
                      <div className="type-item">
                        <span className="type-dot community"></span>
                        <span>Comunidade</span>
                        <span className="type-count">8</span>
                      </div>
                      <div className="type-item">
                        <span className="type-dot info"></span>
                        <span>Informações</span>
                        <span className="type-count">12</span>
                      </div>
                      <div className="type-item">
                        <span className="type-dot system"></span>
                        <span>Sistema</span>
                        <span className="type-count">19</span>
                      </div>
                    </div>
                  </div>

                  <div className="sidebar-card">
                    <h4>🔔 Preferências</h4>
                    <div className="preference-options">
                      <label className="preference-checkbox">
                        <input type="checkbox" defaultChecked />
                        <span>Alertas de emergência</span>
                      </label>
                      <label className="preference-checkbox">
                        <input type="checkbox" defaultChecked />
                        <span>Notificações de segurança</span>
                      </label>
                      <label className="preference-checkbox">
                        <input type="checkbox" defaultChecked />
                        <span>Atualizações da comunidade</span>
                      </label>
                      <label className="preference-checkbox">
                        <input type="checkbox" />
                        <span>Notificações de marketing</span>
                      </label>
                      <label className="preference-checkbox">
                        <input type="checkbox" defaultChecked />
                        <span>Dicas de segurança</span>
                      </label>
                    </div>
                  </div>

                  <div className="sidebar-card">
                    <h4>📱 Receber Notificações</h4>
                    <div className="notification-methods">
                      <button className="method-button active">
                        <span>📲 Push</span>
                        <span className="method-status">Ativo</span>
                      </button>
                      <button className="method-button">
                        <span>📧 Email</span>
                        <span className="method-status">Inativo</span>
                      </button>
                      <button className="method-button">
                        <span>💬 SMS</span>
                        <span className="method-status">Inativo</span>
                      </button>
                    </div>
                  </div>

                  <div className="sidebar-card emergency-card">
                    <h4>🚨 Alertas Rápidos</h4>
                    <p>Configure alertas para situações específicas:</p>
                    <div className="quick-alerts">
                      <button className="alert-button">
                        ⚠️ Áreas de risco próximas
                      </button>
                      <button className="alert-button">
                        📍 Mudança de localização
                      </button>
                      <button className="alert-button">
                        👥 Atividade da comunidade
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          </AuthRequired>
        );
      
      case 'settings':
        return (
          <AuthRequired 
            isAuthenticated={isAuthenticated}
            onShowAuth={() => {
              setAuthMode('login');
              setShowAuthModal(true);
            }}
          >
            <>
              <h1 className="page-title">Configurações</h1>
              <p className="page-subtitle">Gerencie suas preferências, privacidade e configurações da conta.</p>

              <div className="settings-page-content">
                <div className="profile-section">
                  <div className="profile-header">
                    <div className="profile-avatar-large">
                      <span>{user?.name?.charAt(0) || 'U'}</span>
                    </div>
                    <div className="profile-info">
                      <h3>{user?.name || 'Usuária'}</h3>
                      <p>{user?.email || 'usuária@email.com'}</p>
                      <span className="profile-status">Conta {isAuthenticated ? 'verificada' : 'não verificada'}</span>
                    </div>
                    <button className="secondary-button">
                      ✏️ Editar Perfil
                    </button>
                  </div>
                </div>

                <div className="settings-category">
                  <h3>🔒 Segurança e Privacidade</h3>
                  <div className="settings-grid">
                    <div className="setting-card">
                      <div className="setting-icon">🔐</div>
                      <div className="setting-info">
                        <h4>Senha e Autenticação</h4>
                        <p>Altere sua senha e configure autenticação de dois fatores</p>
                      </div>
                      <button className="text-button">
                        Alterar
                      </button>
                    </div>

                    <div className="setting-card">
                      <div className="setting-icon">📱</div>
                      <div className="setting-info">
                        <h4>Dispositivos Conectados</h4>
                        <p>Gerencie dispositivos com acesso à sua conta</p>
                      </div>
                      <button className="text-button">
                        Gerenciar
                      </button>
                    </div>

                    <div className="setting-card">
                      <div className="setting-icon">👁️</div>
                      <div className="setting-info">
                        <h4>Privacidade</h4>
                        <p>Controle quem pode ver suas informações</p>
                      </div>
                      <button className="text-button">
                        Configurar
                      </button>
                    </div>

                    <div className="setting-card">
                      <div className="setting-icon">🗑️</div>
                      <div className="setting-info">
                        <h4>Dados e Backup</h4>
                        <p>Exporte ou exclua seus dados</p>
                      </div>
                      <button className="text-button">
                        Gerenciar
                      </button>
                    </div>
                  </div>
                </div>

                <div className="settings-category">
                  <h3>⚙️ Preferências do App</h3>
                  <div className="settings-grid">
                    <div className="setting-card">
                      <div className="setting-icon">🔔</div>
                      <div className="setting-info">
                        <h4>Notificações</h4>
                        <p>Configure alertas e notificações push</p>
                      </div>
                      <button className="text-button">
                        Configurar
                      </button>
                    </div>

                    <div className="setting-card">
                      <div className="setting-icon">🌙</div>
                      <div className="setting-info">
                        <h4>Tema</h4>
                        <p>Escolha entre tema claro ou escuro</p>
                      </div>
                      <ThemeSelector />
                    </div>

                    <div className="setting-card">
                      <div className="setting-icon">🗣️</div>
                      <div className="setting-info">
                        <h4>Idioma</h4>
                        <p>Português (Brasil)</p>
                      </div>
                      <button className="text-button">
                        Alterar
                      </button>
                    </div>

                    <div className="setting-card">
                      <div className="setting-icon">📏</div>
                      <div className="setting-info">
                        <h4>Unidades de Medida</h4>
                        <p>Quilômetros ou Milhas</p>
                      </div>
                      <UnitSelector />
                    </div>
                  </div>
                </div>

                <div className="settings-category">
                  <h3>🚨 Configurações de Emergência</h3>
                  <div className="settings-grid">
                    <div className="setting-card">
                      <div className="setting-icon">👥</div>
                      <div className="setting-info">
                        <h4>Contatos de Emergência</h4>
                        <p>3 contatos configurados</p>
                      </div>
                      <button className="text-button">
                        Gerenciar
                      </button>
                    </div>

                    <div className="setting-card">
                      <div className="setting-icon">📍</div>
                      <div className="setting-info">
                        <h4>Compartilhamento de Localização</h4>
                        <p>Configurações de privacidade de localização</p>
                      </div>
                      <button className="text-button">
                        Configurar
                      </button>
                    </div>

                    <div className="setting-card">
                      <div className="setting-icon">🎵</div>
                      <div className="setting-info">
                        <h4>Som do Pânico</h4>
                        <p>Ativar som ao acionar botão de emergência</p>
                      </div>
                      <div className="toggle-switch">
                        <input type="checkbox" id="panic-sound" defaultChecked />
                        <label htmlFor="panic-sound" className="toggle-slider"></label>
                      </div>
                    </div>

                    <div className="setting-card">
                      <div className="setting-icon">📳</div>
                      <div className="setting-info">
                        <h4>Vibração de Emergência</h4>
                        <p>Vibrar ao acionar botão de emergência</p>
                      </div>
                      <div className="toggle-switch">
                        <input type="checkbox" id="panic-vibration" defaultChecked />
                        <label htmlFor="panic-vibration" className="toggle-slider"></label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="settings-category">
                  <h3>💬 Comunicação</h3>
                  <div className="settings-options">
                    <div className="setting-option">
                      <div className="option-info">
                        <h4>Notificações por Email</h4>
                        <p>Receba atualizações importantes por email</p>
                      </div>
                      <div className="toggle-switch">
                        <input type="checkbox" id="email-notifications" defaultChecked />
                        <label htmlFor="email-notifications" className="toggle-slider"></label>
                      </div>
                    </div>

                    <div className="setting-option">
                      <div className="option-info">
                        <h4>Notificações por SMS</h4>
                        <p>Alertas importantes por mensagem de texto</p>
                      </div>
                      <div className="toggle-switch">
                        <input type="checkbox" id="sms-notifications" />
                        <label htmlFor="sms-notifications" className="toggle-slider"></label>
                      </div>
                    </div>

                    <div className="setting-option">
                      <div className="option-info">
                        <h4>Notificações da Comunidade</h4>
                        <p>Atualizações do fórum e comunidade</p>
                      </div>
                      <div className="toggle-switch">
                        <input type="checkbox" id="community-notifications" defaultChecked />
                        <label htmlFor="community-notifications" className="toggle-slider"></label>
                      </div>
                    </div>

                    <div className="setting-option">
                      <div className="option-info">
                        <h4>Alertas de Segurança</h4>
                        <p>Notificações sobre áreas de risco</p>
                      </div>
                      <div className="toggle-switch">
                        <input type="checkbox" id="security-alerts" defaultChecked />
                        <label htmlFor="security-alerts" className="toggle-slider"></label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="settings-category">
                  <h3>🔧 Configurações Avançadas</h3>
                  <div className="settings-grid">
                    <div className="setting-card">
                      <div className="setting-icon">🔄</div>
                      <div className="setting-info">
                        <h4>Atualização em Segundo Plano</h4>
                        <p>Atualizar dados automaticamente</p>
                      </div>
                      <div className="toggle-switch">
                        <input type="checkbox" id="background-update" defaultChecked />
                        <label htmlFor="background-update" className="toggle-slider"></label>
                      </div>
                    </div>

                    <div className="setting-card">
                      <div className="setting-icon">💾</div>
                      <div className="setting-info">
                        <h4>Modo Economia de Bateria</h4>
                        <p>Reduzir consumo de bateria</p>
                      </div>
                      <div className="toggle-switch">
                        <input type="checkbox" id="battery-saver" />
                        <label htmlFor="battery-saver" className="toggle-slider"></label>
                      </div>
                    </div>

                    <div className="setting-card">
                      <div className="setting-icon">📊</div>
                      <div className="setting-info">
                        <h4>Compartilhar Dados Anônimos</h4>
                        <p>Ajudar a melhorar o aplicativo</p>
                      </div>
                      <div className="toggle-switch">
                        <input type="checkbox" id="share-data" defaultChecked />
                        <label htmlFor="share-data" className="toggle-slider"></label>
                      </div>
                    </div>

                    <div className="setting-card">
                      <div className="setting-icon">🐞</div>
                      <div className="setting-info">
                        <h4>Modo Desenvolvedor</h4>
                        <p>Configurações avançadas para desenvolvedores</p>
                      </div>
                      <div className="toggle-switch">
                        <input type="checkbox" id="developer-mode" />
                        <label htmlFor="developer-mode" className="toggle-slider"></label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="settings-category">
                  <h3>📋 Ações da Conta</h3>
                  <div className="account-actions">
                    <button className="action-button secondary">
                      📥 Exportar Dados
                    </button>
                    <button 
                      className="action-button secondary"
                      onClick={() => setShowLogoutModal('delete')}
                    >
                      🗑️ Excluir Conta
                    </button>
                    <button 
                      className="action-button danger"
                      onClick={() => setShowLogoutModal('session')}
                    >
                      🚪 Sair da Conta
                    </button>
                  </div>
                </div>

                <div className="app-info">
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Versão do App</span>
                      <span className="info-value">2.1.0</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Última Atualização</span>
                      <span className="info-value">12/11/2024</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Política de Privacidade</span>
                      <button className="text-button small">Ver</button>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Termos de Uso</span>
                      <button className="text-button small">Ver</button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          </AuthRequired>
        );
      
      case 'auth':
        return (
          <>
            <h1 className="page-title">{isAuthenticated ? 'Sair' : 'Entrar'}</h1>
            <p className="page-subtitle">Gerencie o encerramento da sua sessão e dados da conta.</p>

            <div className="logout-page-content">
              <div className="session-info">
                <div className="session-card">
                  <div className="session-icon">👤</div>
                  <div className="session-details">
                    <h3>Sessão {isAuthenticated ? 'Ativa' : 'Inativa'}</h3>
                    <div className="session-meta">
                      <div className="meta-item">
                        <span className="meta-label">Usuária:</span>
                        <span className="meta-value">{user?.name || 'Não autenticada'}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Email:</span>
                        <span className="meta-value">{user?.email || 'Não disponível'}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Status:</span>
                        <span className="meta-value">{isAuthenticated ? 'Conectada' : 'Desconectada'}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`session-status ${isAuthenticated ? 'active' : ''}`}>
                    <span>●</span>
                    {isAuthenticated ? 'Ativa' : 'Inativa'}
                  </div>
                </div>
              </div>

              <div className="logout-options">
                <h3>Opções de {isAuthenticated ? 'Saída' : 'Entrada'}</h3>
                <div className="options-grid">
                  {isAuthenticated ? (
                    <>
                      <div className="logout-option-card">
                        <div className="option-icon">🚪</div>
                        <div className="option-content">
                          <h4>Sair da Conta</h4>
                          <p>Encerre sua sessão atual e faça login novamente quando quiser</p>
                          <ul className="option-features">
                            <li>✓ Mantém todos os seus dados</li>
                            <li>✓ Histórico preservado</li>
                            <li>✓ Configurações salvas</li>
                          </ul>
                        </div>
                        <button 
                          className="logout-button secondary"
                          onClick={() => setShowLogoutModal('session')}
                        >
                          Sair da Conta
                        </button>
                      </div>

                      <div className="logout-option-card">
                        <div className="option-icon">🗑️</div>
                        <div className="option-content">
                          <h4>Excluir Conta</h4>
                          <p>Remova permanentemente sua conta e todos os dados associados</p>
                          <ul className="option-features">
                            <li>⚠️ Todos os dados serão perdidos</li>
                            <li>⚠️ Histórico excluído</li>
                            <li>⚠️ Ação irreversível</li>
                          </ul>
                        </div>
                        <button 
                          className="logout-button danger"
                          onClick={() => setShowLogoutModal('delete')}
                        >
                          Excluir Conta
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="logout-option-card">
                      <div className="option-icon">🔐</div>
                      <div className="option-content">
                        <h4>Fazer Login</h4>
                        <p>Acesse sua conta para usar todas as funcionalidades do app</p>
                        <ul className="option-features">
                          <li>✓ Acesso completo ao app</li>
                          <li>✓ Histórico pessoal</li>
                          <li>✓ Configurações salvas</li>
                        </ul>
                      </div>
                      <button 
                        className="logout-button primary"
                        onClick={() => {
                          setAuthMode('login');
                          setShowAuthModal(true);
                        }}
                      >
                        Fazer Login
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {showLogoutModal && (
              <LogoutModal 
                type={showLogoutModal}
                onClose={() => setShowLogoutModal(null)}
                onConfirm={handleLogout}
              />
            )}
          </>
        );
      
      default:
        return (
          <div className="placeholder">
            <h2>{menuItems.find(m => m.id === activePage)?.label}</h2>
            <p>Funcionalidade em desenvolvimento...</p>
          </div>
        );
    }
  };

  return (
    <div className="app">
      <nav className="sidebar">
        <div className="logo">
          <div className="logo-icon">
            <img 
              src={securityLogo}
              alt="Logo Segurança Feminina" 
              className="logo-image"
            />
          </div>
          <span className="logo-title">Segurança Feminina</span>
        </div>
        <div className="menu">
          {menuItems.map(item => (
            <div
              key={item.id}
              className={`menu-item ${activePage === item.id ? 'active' : ''} ${item.requiresAuth ? 'requires-auth' : ''}`}
              onClick={() => handleMenuClick(item)}
            >
              <item.icon />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        
        {/* Status de autenticação na sidebar */}
        <div className="auth-status">
          {isAuthenticated ? (
            <div className="user-info-sidebar">
              <div className="user-avatar-small">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="user-details">
                <span className="user-name">{user?.name || 'Usuária'}</span>
                <span className="user-status">Conectada</span>
              </div>
            </div>
          ) : (
            <button 
              className="login-prompt"
              onClick={() => {
                setAuthMode('login');
                setShowAuthModal(true);
              }}
            >
              🔐 Fazer Login
            </button>
          )}
        </div>
      </nav>

      <main className="main">
        <header className="header">
          <div className="search-container">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" className="search-input" placeholder="Pesquisar..." />
          </div>
          <div className="header-icons">
            <NotificationIcon />
            <div className="profile-avatar">
              {isAuthenticated ? (
                <div 
                  className="authenticated-user"
                  onClick={() => setActivePage('settings')}
                >
                  {user?.name?.charAt(0) || 'U'}
                </div>
              ) : (
                <div 
                  className="guest-user"
                  onClick={() => {
                    setAuthMode('login');
                    setShowAuthModal(true);
                  }}
                >
                  <span>👤</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mensagem de autenticação */}
        {authMessage && (
          <div className={`auth-message ${authMessage.split('::')[0]}`}>
            {authMessage.split('::')[1]}
          </div>
        )}

        <div className="content">
          {renderPage()}
        </div>
      </main>

      {/* Modal de Autenticação */}
      {showAuthModal && (
        <div className="modal-overlay">
          <div className="modal auth-modal">
            <button className="modal-close" onClick={() => setShowAuthModal(false)}>
              ✕
            </button>
            
            <div className="auth-tabs">
              <button 
                className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => setAuthMode('login')}
              >
                Entrar
              </button>
              <button 
                className={`auth-tab ${authMode === 'register' ? 'active' : ''}`}
                onClick={() => setAuthMode('register')}
              >
                Cadastrar
              </button>
            </div>

            {authMessage && (
              <div className={`auth-message ${authMessage.split('::')[0]}`}>
                {authMessage.split('::')[1]}
              </div>
            )}

            {authMode === 'login' ? (
              <form onSubmit={handleLogin} className="auth-form">
                <h2>Entrar na Conta</h2>
                
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({...prev, email: e.target.value}))}
                    required
                    placeholder="seu@email.com"
                  />
                </div>

                <div className="form-group">
                  <label>Senha:</label>
                  <input
                    type="password"
                    value={loginData.password_hash}
                    onChange={(e) => setLoginData(prev => ({...prev, password_hash: e.target.value}))}
                    required
                    placeholder="Sua senha"
                  />
                </div>

                <button type="submit" className="primary-button">
                  Entrar
                </button>

                <div className="auth-links">
                  <button type="button" className="text-button">
                    Esqueci minha senha
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="auth-form">
                <h2>Criar Conta</h2>
                
                <div className="form-group">
                  <label>Nome completo:</label>
                  <input
                    type="text"
                    value={registerData.name}
                    onChange={(e) => setRegisterData(prev => ({...prev, name: e.target.value}))}
                    required
                    placeholder="Seu nome completo"
                  />
                </div>

                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData(prev => ({...prev, email: e.target.value}))}
                    required
                    placeholder="seu@email.com"
                  />
                </div>

                <div className="form-group">
                  <label>Senha:</label>
                  <input
                    type="password"
                    value={registerData.password_hash}
                    onChange={(e) => setRegisterData(prev => ({...prev, password_hash: e.target.value}))}
                    required
                    placeholder="Crie uma senha segura"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Idade:</label>
                    <input
                      type="number"
                      value={registerData.age}
                      onChange={(e) => setRegisterData(prev => ({...prev, age: e.target.value}))}
                      required
                      min="1"
                      max="120"
                      placeholder="18"
                    />
                  </div>
                  <div className="form-group">
                    <label>Gênero:</label>
                    <select
                      value={registerData.gender}
                      onChange={(e) => setRegisterData(prev => ({...prev, gender: e.target.value}))}
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="female">Feminino</option>
                      <option value="male">Masculino</option>
                      <option value="other">Outro</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Telefone:</label>
                  <input
                    type="tel"
                    value={registerData.phoneNumber}
                    onChange={(e) => setRegisterData(prev => ({...prev, phoneNumber: e.target.value}))}
                    required
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Cidade:</label>
                    <input
                      type="text"
                      value={registerData.city}
                      onChange={(e) => setRegisterData(prev => ({...prev, city: e.target.value}))}
                      placeholder="Sua cidade"
                    />
                  </div>
                  <div className="form-group">
                    <label>Bairro:</label>
                    <input
                      type="text"
                      value={registerData.neighborhood}
                      onChange={(e) => setRegisterData(prev => ({...prev, neighborhood: e.target.value}))}
                      placeholder="Seu bairro"
                    />
                  </div>
                </div>

                <button type="submit" className="primary-button">
                  Criar Conta
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal de Logout (existente) */}
      {showLogoutModal && (
        <LogoutModal 
          type={showLogoutModal}
          onClose={() => setShowLogoutModal(null)}
          onConfirm={handleLogout}
        />
      )}
    </div>
  );
}