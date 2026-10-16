package proxy_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"proxyai/core/pkg/proxy"
)

func TestWebshareManager_FetchProxies_Success(t *testing.T) {
	mockResponse := proxy.WebshareListResponse{
		Count: 2,
		Results: []proxy.ProxyItem{
			{
				ID:           "p1",
				ProxyAddress: "185.199.228.14",
				Port:         8168,
				Valid:        true,
				CountryCode:  "US",
				CityName:     "New York",
			},
			{
				ID:           "p2",
				ProxyAddress: "177.54.148.210",
				Port:         8168,
				Valid:        true,
				CountryCode:  "BR",
				CityName:     "São Paulo",
			},
		},
	}

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("Authorization") != "Token mock-token" {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(mockResponse)
	}))
	defer server.Close()

	mgr := proxy.NewWebshareManager("mock-token", server.URL)
	err := mgr.SyncProxies()
	if err != nil {
		t.Fatalf("esperava sucesso na sincronização, obteve erro: %v", err)
	}

	p, err := mgr.GetProxyByCountry("US")
	if err != nil {
		t.Fatalf("esperava encontrar proxy dos EUA, obteve erro: %v", err)
	}

	if p.ProxyAddress != "185.199.228.14" {
		t.Errorf("proxy incorreto retornado: %s", p.ProxyAddress)
	}
}

func TestWebshareManager_CountryNotFound(t *testing.T) {
	mgr := proxy.NewWebshareManager("mock-token", "http://localhost")
	_, err := mgr.GetProxyByCountry("JP")
	if err != proxy.ErrNoProxyAvailable {
		t.Fatalf("esperava ErrNoProxyAvailable, obteve: %v", err)
	}
}
