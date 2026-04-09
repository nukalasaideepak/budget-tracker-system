import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompareService, DomainDetail, CompareResult, PriceHistory } from '../services/compare.service';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="compare-container animate-fade">
      <header class="page-header">
        <h1>Compare<span class="accent">Karo</span></h1>
        <p class="subtitle">Find the best deals across multiple platforms instantly.</p>
      </header>

      <!-- Global Location Section -->
      <section class="global-location glass animate-slide-in">
        <div class="location-wrapper">
          <span class="icon-loc">📍</span>
          <input type="text" [(ngModel)]="currentLocation" 
                 (ngModelChange)="onLocationInput($event)"
                 (focus)="showLocationSuggestions=true" 
                 (blur)="hideSuggestions('location')"
                 placeholder="Detecting your location or type manually...">
          <button class="btn-locate" (click)="locateMe()" title="Locate Me">🎯</button>
          
          @if (showLocationSuggestions && suggestionsLocation.length > 0) {
             <ul class="suggestions-dropdown glass-deep">
               @for (s of suggestionsLocation; track s) {
                  <li (mousedown)="selectSuggestion(s, 'location')">📍 {{ s }}</li>
               }
             </ul>
          }
        </div>
      </section>

      <!-- Domain and Search Section -->
      @if (domains().length > 0) {
        <section class="domains-scroll">
          <div class="domains-grid">
            @for (domain of domains(); track domain.name) {
              <div class="domain-card glass" 
                   [class.active]="selectedDomain() === domain.name"
                   [style.--domain-color]="domain.color"
                   (click)="selectDomain(domain)">
                <div class="domain-icon" [style.background]="domain.color + '20'" [style.color]="domain.color">
                  {{ domain.icon }}
                </div>
                <div class="domain-info">
                  <h3>{{ domain.name }}</h3>
                  <p>{{ domain.providerCount }} providers</p>
                </div>
              </div>
            }
          </div>
        </section>
      } @else if (activeDomain()) {
        <section class="discovery-header glass animate-slide-in">
           <div class="header-inner">
             <span class="icon-big">{{ activeDomain()?.icon }}</span>
             <div>
               <h2>{{ activeDomain()?.name }} Comparison</h2>
               <p>{{ activeDomain()?.description }}</p>
             </div>
           </div>
        </section>
      }

      <!-- Search Section -->
      @if (activeDomain()) {
        <section class="search-section glass animate-slide-in">
          <div class="search-header">
            <h2 [style.color]="activeDomain()?.color">🔍 Locate a Show</h2>
          </div>
          
          <div class="search-form">
            <!-- Transportation and Bus Tickets need from/to -->
            @if (activeDomain()?.name === 'Transportation' || activeDomain()?.name === 'Bus Tickets') {
              <div class="input-group">
                <span class="input-icon">📍</span>
                <input type="text" [(ngModel)]="searchFrom" 
                       (ngModelChange)="onFromInput($event)" (focus)="showFromSuggestions=true" (blur)="hideSuggestions('from')"
                       placeholder="From (e.g., Delhi)">
                @if (showFromSuggestions && suggestionsFrom.length > 0) {
                   <ul class="suggestions-dropdown glass-deep">
                     @for (s of suggestionsFrom; track s) {
                        <li (mousedown)="selectSuggestion(s, 'from')">📍 {{ s }}</li>
                     }
                   </ul>
                }
              </div>
              <div class="input-group">
                <span class="input-icon">🏁</span>
                <input type="text" [(ngModel)]="searchTo" 
                       (ngModelChange)="onToInput($event)" (focus)="showToSuggestions=true" (blur)="hideSuggestions('to')"
                       placeholder="To (e.g., Mumbai)">
                @if (showToSuggestions && suggestionsTo.length > 0) {
                   <ul class="suggestions-dropdown glass-deep">
                     @for (s of suggestionsTo; track s) {
                        <li (mousedown)="selectSuggestion(s, 'to')">🏁 {{ s }}</li>
                     }
                   </ul>
                }
              </div>
            } @else {
              <!-- General Query for Food, Groceries, Movies, Travel -->
              <div class="input-group flex-1">
                <span class="input-icon">🔍</span>
                <input type="text" [(ngModel)]="searchQuery" 
                       (ngModelChange)="onQueryInput($event)" (focus)="showQuerySuggestions=true" (blur)="hideSuggestions('query')"
                       [placeholder]="getPlaceholder(activeDomain()?.name || '')" (keyup.enter)="compare()">
                @if (showQuerySuggestions && suggestionsQuery.length > 0) {
                   <ul class="suggestions-dropdown glass-deep">
                     @for (s of suggestionsQuery; track s) {
                        <li (mousedown)="selectSuggestion(s, 'query')">✨ {{ s }}</li>
                     }
                   </ul>
                }
              </div>
            }
            
            <button class="btn btn-primary" [style.background]="activeDomain()?.color" (click)="compare()" [disabled]="loading()">
              {{ loading() ? 'Searching...' : 'Compare Prices' }}
            </button>
          </div>
        </section>

        <!-- Movie Discovery Mode -->
        @if (activeDomain()?.name === 'Cinemas' && !searchQuery && !loading() && results().length === 0) {
          <section class="discovery-section animate-fade-in">
            <h3 class="section-title">Now Playing (April 2026)</h3>
            <div class="movies-grid">
              @for (movie of featuredMovies; track movie.title) {
                <div class="movie-card glass" (click)="selectMovie(movie.title)">
                  <div class="poster-container">
                    <img [src]="movie.poster" alt="poster" class="movie-poster">
                    <div class="poster-overlay">
                      <span class="rating">⭐ {{ movie.rating }}</span>
                      <button class="btn-book">Compare Shows</button>
                    </div>
                  </div>
                  <div class="movie-info">
                    <h4>{{ movie.title }}</h4>
                    <p>Live Comparisons</p>
                  </div>
                </div>
              }
            </div>
          </section>
        }
      }

      <!-- Results Section -->
      @if (results().length > 0) {
        <section class="results-section">
          <h3 class="section-title">Best Deals Found</h3>
          <div class="results-grid">
            @for (result of results(); track result.providerName; let i = $index) {
              <div class="result-card glass" [class.best-deal]="result.bestDeal" [style.animation-delay]="(i * 0.1) + 's'">
                
                @if (result.bestDeal) {
                  <div class="badge-best">🏆 CHEAPEST</div>
                }
                
                <div class="result-header">
                  <div class="provider-info">
                    <img [src]="result.logoUrl" (error)="onImgError($event)" class="provider-logo" alt="logo">
                    <div>
                      <h4 class="provider-name">{{ result.providerName }}</h4>
                      <p class="tagline">{{ result.tagline }}</p>
                    </div>
                  </div>
                  <div class="price-info">
                    <div class="price-header">
                      <h2 class="price">{{ result.price | currency:'INR':'symbol-narrow' }}</h2>
                      <button class="btn-notify" (click)="toggleNotification(result)" [class.active]="isNotifying(result)" title="Notify me on price drop">
                        <span class="bell-icon">{{ isNotifying(result) ? '🔔' : '🔕' }}</span>
                      </button>
                    </div>
                    <p class="eta">⏳ {{ result.eta }}</p>
                    @if (result.metadata['venueDistance']) {
                      <p class="distance">📍 {{ result.metadata['venueDistance'] }}</p>
                    }
                  </div>
                </div>

                <div class="buy-hatke-actions">
                  <button class="btn-trend" (click)="toggleGraph(result)">
                    <span class="icon">📈</span> {{ isGraphVisible(result) ? 'Hide' : 'Price Trend' }}
                  </button>
                  @if (result.metadata['voucherCode']) {
                    <div class="mini-voucher-badge">
                      🔥 {{ result.metadata['voucherDiscount'] }} Apply: <code>{{ result.metadata['voucherCode'] }}</code>
                    </div>
                  }
                </div>

                <!-- BuyHatke Price History Graph -->
                @if (isGraphVisible(result)) {
                  <div class="price-graph-container animate-slide-down">
                    <div class="graph-header">
                      <span>7-Day Price History</span>
                      <span class="best-time">✅ Best time to buy</span>
                    </div>
                    <div class="svg-graph">
                      <svg viewBox="0 0 400 100" class="trend-svg">
                         <path [attr.d]="getGraphPath(result)" class="trend-path" fill="none" stroke-width="3" />
                         @for (p of getHistoryPoints(result); track $index) {
                            <circle [attr.cx]="$index * 57 + 10" [attr.cy]="p.y" r="4" class="trend-point" />
                         }
                      </svg>
                    </div>
                    <div class="graph-labels">
                      <span>7d ago</span>
                      <span>Now</span>
                    </div>
                  </div>
                }

                <!-- Metadata details (convenience fee, ride type, etc) -->
                @if (hasStandardMetadata(result.metadata)) {
                  <div class="metadata-grid">
                    @for (key of getStandardMetaKeys(result.metadata); track key) {
                      <div class="meta-item">
                        <span class="meta-label">{{ formatKey(key) }}</span>
                        <span class="meta-value">{{ result.metadata[key] }}</span>
                      </div>
                    }
                  </div>
                }

                <!-- Splashy Voucher Box (Hidden if mini-badge shown above) -->
                @if (!isGraphVisible(result) && result.metadata['voucherCode']) {
                  <div class="voucher-box">
                    <div class="voucher-left">
                      <span class="gift-icon">🎁</span>
                      <div class="voucher-text">
                        <strong>{{ result.metadata['voucherDiscount'] }}</strong>
                        <span>Available Online!</span>
                      </div>
                    </div>
                    <div class="voucher-code-wrap">
                      <code class="voucher-code">{{ result.metadata['voucherCode'] }}</code>
                    </div>
                  </div>
                }

                <div class="result-actions">
                  <button class="btn btn-outline" [style.color]="activeDomain()?.color" [style.border-color]="activeDomain()?.color" (click)="triggerBooking(result)">
                    Book on {{ result.providerName }}
                  </button>
                </div>
              </div>
            }
          </div>
        </section>
      } @else if (searched() && !loading()) {
        <div class="no-results glass">
          <p>No results found for your search. Try adjusting your query.</p>
        </div>
      }
    </div>

    <!-- Redirection Overlay -->
    @if (redirecting()) {
      <div class="redirect-overlay glass-high animate-fade">
        <div class="redirect-content">
          <div class="loader-ring"></div>
          <div class="provider-badge animate-scale">
            <img [src]="redirectTarget()?.logoUrl" class="redirect-logo">
          </div>
          <h2>Redirecting to {{ redirectTarget()?.providerName }}</h2>
          <p>Handing over your booking for <strong>{{ searchQuery }}</strong></p>
          <div class="theater-chip">📍 {{ redirectTarget()?.tagline }}</div>
          <div class="secure-tag">
            <span class="icon">🔒</span> Secure Handshake in Progress...
          </div>
        </div>
      </div>
    }

    <!-- STYLES -->
    <style>
      .compare-container { max-width: 1000px; margin: 0 auto; padding-bottom: 80px; position: relative; }
      .page-header { margin-bottom: 32px; }
      .page-header h1 { font-size: 2.5rem; font-weight: 800; }
      .accent { color: var(--accent-emerald); }
      .subtitle { color: var(--text-secondary); margin-top: 8px; font-size: 1.1rem; }

      .global-location { padding: 16px 24px; border-radius: 20px; margin-bottom: 24px; display: flex; justify-content: center; }
      .location-wrapper { position: relative; width: 100%; max-width: 600px; display: flex; align-items: center; }
      .icon-loc { position: absolute; left: 16px; font-size: 1.2rem; }
      .location-wrapper input { 
        width: 100%; padding: 16px 60px 16px 48px; border-radius: 16px; 
        background: rgba(0,0,0,0.2); border: 1px solid var(--glass-border); 
        color: var(--text-primary); font-size: 1.1rem; outline: none; transition: border-color 0.2s;
      }
      .location-wrapper input:focus { border-color: var(--accent-emerald); }
      .btn-locate { 
        position: absolute; right: 12px; background: rgba(255,255,255,0.1); border: none; 
        border-radius: 12px; padding: 10px; cursor: pointer; font-size: 1.2rem; transition: 0.2s;
      }
      .btn-locate:hover { background: rgba(16, 185, 129, 0.2); transform: scale(1.1); }

      .domains-scroll { margin-bottom: 32px; overflow-x: auto; padding-bottom: 12px; }
      
      .domains-scroll::-webkit-scrollbar { height: 6px; }
      .domains-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      
      .domains-grid { display: flex; gap: 16px; min-width: max-content; }
      
      .domain-card { 
        display: flex; align-items: center; gap: 16px; padding: 16px 24px; border-radius: 20px; 
        cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); border: 2px solid transparent; 
      }
      .domain-card:hover { background: rgba(255, 255, 255, 0.08); transform: translateY(-2px); }
      .domain-card.active { border-color: var(--domain-color); background: rgba(255, 255, 255, 0.05); }
      
      .domain-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
      .domain-info h3 { font-weight: 700; margin: 0 0 4px 0; font-size: 1.1rem; }
      .domain-info p { margin: 0; font-size: 0.8rem; color: var(--text-secondary); }

      .search-section { padding: 32px; border-radius: 24px; margin-bottom: 40px; }
      .search-header { margin-bottom: 24px; }
      .search-header h2 { font-size: 1.5rem; display: flex; align-items: center; gap: 12px; margin: 0 0 8px 0; }
      .search-header p { color: var(--text-secondary); margin: 0; }

      .search-form { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; }
      .input-group { position: relative; flex: 1; min-width: 250px; }
      .input-group.flex-1 { flex: 1; }
      .input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 1.2rem; }
      .input-group input {
        width: 100%; padding: 16px 16px 16px 48px; border-radius: 16px;
        background: rgba(0, 0, 0, 0.2); border: 1px solid var(--glass-border);
        color: var(--text-primary); outline: none; font-size: 1rem; transition: border-color 0.2s;
      }
      .input-group input:focus { border-color: var(--accent-emerald); background: rgba(0, 0, 0, 0.4); }

      .btn { padding: 16px 32px; border-radius: 16px; font-weight: 700; border: none; cursor: pointer; transition: all 0.2s; font-size: 1rem; color: #fff; }
      .btn:hover { filter: brightness(1.1); transform: translateY(-2px); }
      .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

      .results-section { animation: fadeIn 0.5s; }
      .section-title { margin-bottom: 24px; font-size: 1.3rem; }
      .results-grid { display: flex; flex-direction: column; gap: 24px; }

      .result-card { padding: 24px; border-radius: 24px; position: relative; border: 1px solid var(--glass-border); overflow: hidden; animation: slideUp 0.5s backwards; }
      .result-card.best-deal { border-color: var(--accent-emerald); background: linear-gradient(145deg, rgba(16, 185, 129, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%); }
      .badge-best { position: absolute; top: 0; right: 0; background: var(--accent-emerald); color: #000; padding: 6px 16px; font-weight: 800; font-size: 0.8rem; border-bottom-left-radius: 16px; }

      .result-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
      .provider-info { display: flex; align-items: center; gap: 16px; }
      .provider-logo { width: 56px; height: 56px; border-radius: 16px; object-fit: cover; background: #fff; border: 2px solid rgba(255,255,255,0.1); }
      .provider-name { font-size: 1.3rem; font-weight: 800; margin: 0 0 4px 0; }
      .tagline { margin: 0; font-size: 0.85rem; color: var(--text-secondary); }

      .price-info { text-align: right; }
      .price { font-size: 2rem; font-weight: 800; margin: 0; color: var(--text-primary); }
      .best-deal .price { color: var(--accent-emerald); }
      .eta { margin: 4px 0 0 0; font-size: 0.9rem; color: var(--text-secondary); }

      .metadata-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 16px; margin-bottom: 24px; padding: 16px; background: rgba(0,0,0,0.2); border-radius: 16px; }
      .meta-item { display: flex; flex-direction: column; gap: 4px; }
      .meta-label { font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; }
      .meta-value { font-weight: 600; font-size: 0.95rem; }

      /* Voucher Splashy Styling */
      .voucher-box {
        display: flex; align-items: center; justify-content: space-between;
        background: linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(244, 63, 94, 0.05) 100%);
        border: 1px dashed rgba(236, 72, 153, 0.4);
        padding: 16px 24px; border-radius: 16px; margin-bottom: 24px;
      }
      .voucher-left { display: flex; align-items: center; gap: 16px; }
      .gift-icon { font-size: 2rem; animation: bounce 2s infinite; }
      .voucher-text strong { display: block; font-size: 1.1rem; color: #ec4899; margin-bottom: 2px; }
      .voucher-text span { font-size: 0.8rem; color: var(--text-secondary); }
      .voucher-code-wrap { background: rgba(0,0,0,0.3); padding: 8px 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); }
      .voucher-code { font-family: monospace; font-size: 1.2rem; font-weight: 800; letter-spacing: 2px; color: #fff; }

      .result-actions { display: flex; justify-content: flex-end; }
      .btn-outline { background: transparent; padding: 12px 24px; border: 2px solid; color: inherit; text-decoration: none; display: inline-block; }
      .btn-outline:hover { background: currentColor; color: #000 !important; }
      
      /* Discovery Styles */
      .movies-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 24px; }
      .movie-card { padding: 0; border-radius: 20px; overflow: hidden; cursor: pointer; transition: 0.3s; }
      .movie-card:hover { transform: scale(1.03); }
      .poster-container { position: relative; height: 280px; }
      .movie-poster { width: 100%; height: 100%; object-fit: cover; }
      .poster-overlay { 
        position: absolute; top:0; left:0; right:0; bottom:0; padding: 16px; 
        background: linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.8));
        display: flex; flex-direction: column; justify-content: flex-end; opacity: 0; transition: 0.3s;
      }
      .movie-card:hover .poster-overlay { opacity: 1; }
      .rating { color: var(--accent-emerald); font-weight: 800; margin-bottom: 8px; }
      .btn-book { background: var(--accent-emerald); color: #000; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 700; }
      .movie-info { padding: 16px; }
      .movie-info h4 { margin: 0 0 4px 0; font-size: 1.1rem; }
      .movie-info p { margin:0; font-size: 0.8rem; color: var(--text-secondary); }
      .distance { font-size: 0.85rem; color: var(--accent-emerald); font-weight: 600; margin-top: 4px; }

      .price-header { display: flex; align-items: center; gap: 12px; justify-content: flex-end; }
      .btn-notify { background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
      .btn-notify:hover { background: rgba(255, 255, 255, 0.1); }
      .btn-notify.active { border-color: #facc15; background: rgba(250, 204, 21, 0.1); }
      
      .buy-hatke-actions { display: flex; align-items: center; gap: 16px; margin-top: 16px; margin-bottom: 20px; }
      .btn-trend { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: var(--text-primary); padding: 8px 16px; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 0.85rem; display: flex; align-items: center; gap: 6px; transition: 0.2s; }
      .btn-trend:hover { background: rgba(255,255,255,0.1); }
      .mini-voucher-badge { background: linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(244, 63, 94, 0.1) 100%); border: 1px dashed rgba(236, 72, 153, 0.4); padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; color: #ec4899; flex: 1; }

      .price-graph-container { margin-top: 24px; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); }
      .graph-header { display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 0.85rem; }
      .best-time { color: var(--accent-emerald); font-weight: 700; }
      .svg-graph { height: 100px; width: 100%; }
      .trend-svg { width: 100%; height: 100%; }
      .trend-path { stroke: var(--accent-emerald); filter: drop-shadow(0 0 5px rgba(16, 185, 129, 0.5)); }
      .trend-point { fill: var(--accent-emerald); }
      .graph-labels { display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary); margin-top: 8px; }

      .discovery-header { padding: 24px; border-radius: 24px; margin-bottom: 32px; }
      .header-inner { display: flex; align-items: center; gap: 20px; }
      .icon-big { font-size: 3rem; }
      .header-inner h2 { margin: 0 0 4px 0; font-size: 1.8rem; }
      .header-inner p { margin: 0; color: var(--text-secondary); }

      .no-results { padding: 40px; text-align: center; border-radius: 24px; font-weight: 600; color: var(--text-secondary); }

      @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
      
      /* Suggestions Dropdown */
      .suggestions-dropdown { 
          position: absolute; top: calc(100% + 8px); left: 0; right: 0; z-index: 100;
          margin: 0; padding: 8px; list-style: none; border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.1); max-height: 250px; overflow-y: auto;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
      }
      .glass-deep { background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(24px); }
      .suggestions-dropdown li {
          padding: 12px 16px; border-radius: 12px; cursor: pointer; color: var(--text-secondary);
          transition: 0.2s; font-size: 0.95rem; display: flex; align-items: center; gap: 8px;
      }
      .suggestions-dropdown li:hover {
          background: rgba(255,255,255,0.1); color: #fff;
      }
      
      /* Redirection Splash Styles */
      .redirect-overlay {
        position: fixed; inset: 0; z-index: 9999;
        display: flex; align-items: center; justify-content: center;
        background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(20px);
      }
      .redirect-content { text-align: center; max-width: 400px; padding: 40px; }
      .loader-ring {
        width: 120px; height: 120px; border: 4px solid rgba(255,255,255,0.1);
        border-top: 4px solid var(--accent-emerald); border-radius: 50%;
        margin: 0 auto 32px; animation: spin 1s linear infinite;
        position: relative;
      }
      .provider-badge {
        position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 64px; height: 64px; background: #fff; border-radius: 16px; 
        padding: 8px; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 0 40px rgba(16, 185, 129, 0.4);
      }
      .redirect-logo { width: 100%; height: 100%; object-fit: contain; }
      .redirect-content h2 { font-size: 1.8rem; margin: 0 0 12px 0; }
      .redirect-content p { color: var(--text-secondary); margin: 0 0 20px 0; }
      .theater-chip {
        display: inline-block; padding: 8px 16px; background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
        font-weight: 600; color: var(--accent-emerald); margin-bottom: 32px;
      }
      .secure-tag { font-size: 0.8rem; color: var(--text-secondary); opacity: 0.7; }
      
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      @keyframes scale { from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; } to { transform: translate(-50%, -50%) scale(1); opacity: 1; } }

      /* Ensure wrappers have relative positioning for absolute dropdowns */
      .location-wrapper, .input-group { position: relative; }
    </style>
  `
})
export class CompareComponent implements OnInit {
  private compareService = inject(CompareService);
  // Reverting checkout, but keeping router in case of other needs
  private router = inject(Router);

  domains = signal<DomainDetail[]>([]);
  selectedDomain = signal<string | null>(null);
  activeDomain = signal<DomainDetail | null>(null);
  
  searchQuery = '';
  searchFrom = '';
  searchTo = '';
  
  currentLocation = '';
  currentLat?: number;
  currentLng?: number;

  results = signal<CompareResult[]>([]);
  loading = signal(false);
  searched = signal(false);
  
  // Redirection state
  redirecting = signal(false);
  redirectTarget = signal<CompareResult | null>(null);

  // BuyHatke states
  visibleGraphs = signal<Set<string>>(new Set());
  historyData = signal<Map<string, number[]>>(new Map());
  notifiedResults = signal<Set<string>>(new Set());

  // Suggestions state
  suggestionsLocation: string[] = [];
  suggestionsFrom: string[] = [];
  suggestionsTo: string[] = [];
  suggestionsQuery: string[] = [];

  showLocationSuggestions = false;
  showFromSuggestions = false;
  showToSuggestions = false;
  showQuerySuggestions = false;

  private locationSub = new Subject<string>();
  private fromSub = new Subject<string>();
  private toSub = new Subject<string>();
  private querySub = new Subject<string>();

  // Expanded Dictionaries
  foodDictionary = ['Chicken Biryani', 'Mutton Biryani', 'Margherita Pizza', 'Pepperoni Pizza', 'Veg Burger', 'Chicken Burger', 'Paneer Butter Masala', 'Masala Dosa', 'Plain Dosa', 'White Sauce Pasta', 'Red Sauce Pasta', 'Chicken Fried Rice', 'Egg Fried Rice', 'Hakka Noodles', 'Chicken 65', 'Butter Naan', 'Garlic Bread', 'Tandoori Chicken', 'Shawarma', 'Momos', 'French Fries', 'Chole Bhature', 'Idli Sambar', 'Vada Pav', 'Ice Cream'];
  groceryDictionary = ['Amul Milk 1L', 'Nandini Milk 500ml', 'Brown Bread', 'White Bread', 'Farm Eggs 6pcs', 'Eggs 12pcs', 'Red Onion 1kg', 'Tomato 1kg', 'Potato 1kg', 'Carrot 500g', 'Apple 1kg', 'Banana 1 Dozen', 'Mango 1kg', 'Maggi Noodles 4-Pack', 'Yippee Noodles', 'Curd 500g', 'Butter 100g', 'Cheese Slices', 'Paneer 200g', 'Basmati Rice 5kg', 'Aashirvaad Atta 5kg', 'Toor Dal 1kg', 'Sugar 1kg', 'Tata Salt 1kg'];
  movieDictionary = ['Bhooth Bangla', 'The Super Mario Galaxy Movie', 'MaatruBhumi', 'Dacoit: A Love Story', 'Michael'];
  travelDictionary = ['Goa Package', 'Manali Adventure', 'Kerala Backwaters', 'Dubai Shopping Festival', 'Bali Honeymoon', 'Paris Gateway'];
  busDictionary = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad', 'Surat', 'Lucknow', 'Jaipur', 'Indore'];

  featuredMovies = [
    { title: 'Bhooth Bangla', poster: 'https://m.media-amazon.com/images/M/MV5BYTE0M2YwZjYtODU3OC00YTY3LTlmNWEtYjZkMjM4MmVhYjg0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', rating: 4.8 },
    { title: 'MaatruBhumi', poster: 'https://m.media-amazon.com/images/M/MV5BOGZmN2FmOGUtYWUxNy00MGQwLTg2Y2QtNGE4ZDA4YTA3YWE2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', rating: 4.6 },
    { title: 'The Super Mario Galaxy Movie', poster: 'https://m.media-amazon.com/images/M/MV5BNjg0NmI3YmEtMDcyOC00Y2FlLThjNzAtNTVhMWY1YTNlY2JjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', rating: 4.9 },
    { title: 'Michael', poster: 'https://m.media-amazon.com/images/M/MV5BMzVjM2NiOTItMTU2OC00ZWU5LThjYmYtZWFlYWI1ZDY0NGRlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', rating: 4.7 }
  ];

  ngOnInit() {
    this.compareService.getDomains().subscribe({
      next: (data) => {
        this.domains.set(data);
        if (data.length > 0) {
          this.selectDomain(data[0]);
        }
      }
    });

    // Accelerated Subscriptions for API debouncing (Dropped from 400ms to 200ms)
    this.locationSub.pipe(debounceTime(200), distinctUntilChanged()).subscribe(q => this.fetchMapSuggestions(q, 'location'));
    this.fromSub.pipe(debounceTime(200), distinctUntilChanged()).subscribe(q => this.fetchMapSuggestions(q, 'from'));
    this.toSub.pipe(debounceTime(200), distinctUntilChanged()).subscribe(q => this.fetchMapSuggestions(q, 'to'));
    
    // Near instance response for local dictionaries (Dropped from 200ms to 20ms)
    this.querySub.pipe(debounceTime(20), distinctUntilChanged()).subscribe(q => this.generateQuerySuggestions(q));
  }

  // --- Input Handlers ---
  onLocationInput(val: string) {
    this.locationSub.next(val);
    this.showLocationSuggestions = true;
  }
  onFromInput(val: string) {
    this.fromSub.next(val);
    this.showFromSuggestions = true;
  }
  onToInput(val: string) {
    this.toSub.next(val);
    this.showToSuggestions = true;
  }
  onQueryInput(val: string) {
    this.querySub.next(val);
    this.showQuerySuggestions = true;
  }

  hideSuggestions(target: 'location' | 'from' | 'to' | 'query') {
    setTimeout(() => {
      if (target === 'location') this.showLocationSuggestions = false;
      if (target === 'from') this.showFromSuggestions = false;
      if (target === 'to') this.showToSuggestions = false;
      if (target === 'query') this.showQuerySuggestions = false;
    }, 200); // 200ms delay to allow mousedown select event to fire
  }

  selectSuggestion(value: string, target: 'location' | 'from' | 'to' | 'query') {
    if (target === 'location') {
        this.currentLocation = value;
        this.showLocationSuggestions = false;
        this.showLocationSuggestions = false;
        if (this.activeDomain()?.name === 'Transportation' || this.activeDomain()?.name === 'Bus Tickets') this.searchFrom = value;
    }
    if (target === 'from') { this.searchFrom = value; this.showFromSuggestions = false; }
    if (target === 'to') { this.searchTo = value; this.showToSuggestions = false; }
    if (target === 'query') { 
        this.searchQuery = value; 
        this.showQuerySuggestions = false; 
        // Automatically trigger search on select!
        this.compare(); 
    }
  }

  fetchMapSuggestions(query: string, target: 'location' | 'from' | 'to') {
    if (!query || query.length < 2) {
      if (target === 'location') this.suggestionsLocation = [];
      if (target === 'from') this.suggestionsFrom = [];
      if (target === 'to') this.suggestionsTo = [];
      return;
    }
    // Boosted limit to 10
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=10&addressdetails=1`)
      .then(res => res.json())
      .then(data => {
        const places = data.map((d: any) => {
            const road = d.address?.road || d.address?.suburb || d.address?.neighbourhood || '';
            const city = d.address?.city || d.address?.county || d.address?.state || '';
            const combined = road ? `${road}, ${city}` : d.display_name.split(',').slice(0, 3).join(', ');
            return combined.trim().replace(/^,\s*/, ''); // Remove trailing/leading commas
        }).filter((v: string) => v.length > 2);
        
        const unique = Array.from(new Set(places)) as string[];
        if (target === 'location') this.suggestionsLocation = unique;
        if (target === 'from') this.suggestionsFrom = unique;
        if (target === 'to') this.suggestionsTo = unique;
      }).catch(e => console.error("Map query failed: ", e));
  }

  generateQuerySuggestions(query: string) {
    if (!query || query.length < 1) {
      this.suggestionsQuery = [];
      return;
    }
    const q = query.toLowerCase();
    const domain = this.activeDomain()?.name;
    let dict: string[] = [];
    
    if (domain === 'Food Delivery') dict = this.foodDictionary;
    else if (domain === 'Grocery') dict = this.groceryDictionary;
    else if (domain === 'Travel') dict = this.travelDictionary;
    else if (domain === 'Cinemas') dict = this.movieDictionary;
    else if (domain === 'Bus Tickets') dict = this.busDictionary;

    // Show top 8 matches max for UI cleanliness
    this.suggestionsQuery = dict.filter(item => item.toLowerCase().includes(q)).slice(0, 8);
  }

  getDeepLink(result: CompareResult): string {
    const movie = this.searchQuery ? encodeURIComponent(this.searchQuery) : '';
    const theater = result.tagline ? encodeURIComponent(result.tagline) : '';
    const combinedQuery = `${movie}+${theater}`;
    const name = result.providerName.toLowerCase();

    if (!movie) return result.baseUrl; 

    switch (name) {
      case 'bookmyshow': return `https://in.bookmyshow.com/explore/movies?q=${combinedQuery}`;
      case 'paytm movies': return `https://paytm.com/movies/search?q=${combinedQuery}`;
      case 'redbus': return `https://www.redbus.in/bus-tickets/${this.searchFrom}-to-${this.searchTo}`;
      case 'abhibus': return `https://www.abhibus.com/bus-ticket/${this.searchFrom}-to-${this.searchTo}`;
      default: return result.baseUrl;
    }
  }

  triggerBooking(result: CompareResult) {
    this.redirectTarget.set(result);
    this.redirecting.set(true);
    
    // Simulate real-time handshake/handover
    setTimeout(() => {
      const link = this.getDeepLink(result);
      window.open(link, '_blank');
      this.redirecting.set(false);
    }, 1800); 
  }

  selectMovie(title: string) {
    this.searchQuery = title;
    this.compare();
  }

  selectDomain(domain: DomainDetail) {
    this.selectedDomain.set(domain.name);
    this.activeDomain.set(domain);
    this.results.set([]);
    this.searched.set(false);
    this.searchQuery = '';
    this.searchFrom = this.currentLocation; // Auto-fill from global location if it exists
    this.searchTo = '';
  }

  locateMe() {
    if (navigator.geolocation) {
      this.currentLocation = 'Detecting GPS coordinates...';
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentLat = position.coords.latitude;
          this.currentLng = position.coords.longitude;
          this.reverseGeocode(this.currentLat, this.currentLng);
        },
        (error) => {
          console.error("Geolocation error:", error);
          this.currentLocation = '';
          alert("Could not detect location automatically. Please ensure location permissions are granted.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  reverseGeocode(lat: number, lng: number) {
    this.currentLocation = 'Resolving exact address...';
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
      .then(res => res.json())
      .then(data => {
        if (data && data.address) {
          const addr = data.address;
          const road = addr.road || addr.pedestrian || addr.neighbourhood || addr.suburb || '';
          const city = addr.city || addr.town || addr.village || addr.county || '';
          let exactLocation = road ? road + (city ? ', ' + city : '') : '';
          
          if (!exactLocation && data.display_name) {
             exactLocation = data.display_name.split(',').slice(0, 2).join(', ').trim();
          }
          this.currentLocation = exactLocation || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          
          if (this.activeDomain()?.name === 'Transportation') {
             this.searchFrom = this.currentLocation;
          }
        } else {
          this.currentLocation = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        }
      })
      .catch(err => {
        console.error("Reverse geocode failed", err);
        this.currentLocation = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      });
  }

  getPlaceholder(domainName: string): string {
    switch (domainName) {
      case 'Food Delivery': return 'Search for a dish (e.g., Pizza, Biryani)';
      case 'Grocery': return 'Search for items (e.g., Milk, Bread)';
      case 'Travel': return 'Search destination (e.g., Delhi to Goa)';
      case 'Bus Tickets': return 'From (e.g. Bangalore) to (e.g. Goa)';
      case 'Cinemas': return 'Type theater or movie (e.g., Bhooth Bangla)';
      default: return 'What are you looking for?';
    }
  }

  compare() {
    const domain = this.activeDomain();
    if (!domain) return;
    
    // Quick validation
    if (domain.name === 'Transportation') {
      if (!this.searchFrom || !this.searchTo) return;
    } else {
      if (!this.searchQuery) return;
    }

    this.loading.set(true);
    this.searched.set(true);
    
    // Only send Lat/Lng if the searchFrom matches the auto-detected location, otherwise they typed something manually
    const locationBased = (domain.name === 'Transportation' || domain.name === 'Bus Tickets');
    const useGPS = (this.searchFrom === this.currentLocation || !locationBased) ? true : false;
    const lat = useGPS ? this.currentLat : undefined;
    const lng = useGPS ? this.currentLng : undefined;

    this.compareService.compareFares(domain.name, this.searchQuery, this.searchFrom, this.searchTo, lat, lng).subscribe({
      next: (res) => {
        this.results.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.results.set([]);
        this.loading.set(false);
      }
    });
  }

  onImgError(event: any) {
    event.target.src = 'assets/icons/default-provider.png'; // Fallback
    event.target.style.display = 'none'; // Or hide it if no fallback
  }

  hasStandardMetadata(meta: Record<string, string>): boolean {
    return this.getStandardMetaKeys(meta).length > 0;
  }

  getStandardMetaKeys(meta: Record<string, string>): string[] {
    if (!meta) return [];
    return Object.keys(meta).filter(k => k !== 'voucherCode' && k !== 'voucherDiscount');
  }

  formatKey(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, c => c.toUpperCase());
  }

  // --- BuyHatke Logic ---
  isGraphVisible(result: CompareResult): boolean {
    return this.visibleGraphs().has(this.getResultKey(result));
  }

  isNotifying(result: CompareResult): boolean {
    return this.notifiedResults().has(this.getResultKey(result));
  }

  toggleNotification(result: CompareResult) {
    const key = this.getResultKey(result);
    const next = new Set(this.notifiedResults());
    if (next.has(key)) next.delete(key);
    else next.add(key);
    this.notifiedResults.set(next);
  }

  toggleGraph(result: CompareResult) {
    const key = this.getResultKey(result);
    const next = new Set(this.visibleGraphs());
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
      this.fetchHistory(result);
    }
    this.visibleGraphs.set(next);
  }

  private getResultKey(result: CompareResult): string {
    return `${result.providerName}-${result.tagline}`;
  }

  private fetchHistory(result: CompareResult) {
    const key = this.getResultKey(result);
    if (this.historyData().has(key)) return;

    this.compareService.getHistory('Cinemas', this.searchQuery).subscribe((history: PriceHistory[]) => {
      // Filter for this specific provider
      const providerHistory = history
          .filter((h: PriceHistory) => h.providerName === result.providerName)
          .map((h: PriceHistory) => h.price);
      
      const next = new Map(this.historyData());
      // If we don't have enough data, mock a trend for realism
      if (providerHistory.length < 5) {
        const mockData = [
          result.price * 1.1, result.price * 1.05, result.price * 1.15,
          result.price * 1.2, result.price * 1.1, result.price * 1.05, result.price
        ];
        next.set(key, mockData);
      } else {
        next.set(key, providerHistory.slice(-7));
      }
      this.historyData.set(next);
    });
  }

  getGraphPath(result: CompareResult): string {
    const data = this.historyData().get(this.getResultKey(result)) || [];
    if (data.length < 2) return '';
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    return data.map((val, i) => {
      const x = i * 57 + 10;
      const y = 90 - ((val - min) / range * 80);
      return (i === 0 ? 'M' : 'L') + `${x} ${y}`;
    }).join(' ');
  }

  getHistoryPoints(result: CompareResult) {
    const data = this.historyData().get(this.getResultKey(result)) || [];
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    return data.map((val) => ({ y: 90 - ((val - min) / range * 80) }));
  }
}
