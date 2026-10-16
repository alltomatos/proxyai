package proxy

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"sync"
	"time"
)

var (
	ErrNoProxyAvailable = errors.New("nenhum proxy disponivel para os criterios especificados")
)

// ProxyItem representa uma instância de proxy retornada pela Webshare API
type ProxyItem struct {
	ID           string `json:"id"`
	ProxyAddress string `json:"proxy_address"`
	Port         int    `json:"port"`
	Valid        bool   `json:"valid"`
	CountryCode  string `json:"country_code"`
	CityName     string `json:"city_name"`
}

// WebshareListResponse encapsula o envelope paginado da Webshare
type WebshareListResponse struct {
	Count   int         `json:"count"`
	Results []ProxyItem `json:"results"`
}

// WebshareManager gerencia o pool local de proxies
type WebshareManager struct {
	mu      sync.RWMutex
	token   string
	baseURL string
	proxies []ProxyItem
	client  *http.Client
}

// NewWebshareManager instancia o gerenciador
func NewWebshareManager(apiToken string, baseURL string) *WebshareManager {
	if baseURL == "" {
		baseURL = "https://proxy.webshare.io"
	}
	return &WebshareManager{
		token:   apiToken,
		baseURL: baseURL,
		client:  &http.Client{Timeout: 10 * time.Second},
	}
}

// SyncProxies busca a lista atualizada de proxies ativos
func (m *WebshareManager) SyncProxies() error {
	url := fmt.Sprintf("%s/api/v2/proxy/list/?mode=direct&page=1&page_size=100", m.baseURL)
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return err
	}
	req.Header.Set("Authorization", "Token "+m.token)

	resp, err := m.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("webshare api retornou status HTTP %d", resp.StatusCode)
	}

	var data WebshareListResponse
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return err
	}

	m.mu.Lock()
	defer m.mu.Unlock()
	m.proxies = data.Results
	return nil
}

// GetProxyByCountry retorna um proxy saudável do país solicitado
func (m *WebshareManager) GetProxyByCountry(countryCode string) (ProxyItem, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	for _, p := range m.proxies {
		if p.Valid && (countryCode == "" || p.CountryCode == countryCode) {
			return p, nil
		}
	}
	return ProxyItem{}, ErrNoProxyAvailable
}
