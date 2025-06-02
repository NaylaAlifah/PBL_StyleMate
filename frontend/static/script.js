class StyleMateApp {
  constructor() {
    this.apiBaseUrl = "http://localhost:5000/api"
    this.init()
  }

  init() {
    this.bindEvents()
    this.checkApiHealth()
  }

  bindEvents() {
    const form = document.getElementById("recommendationForm")
    form.addEventListener("submit", (e) => {
      e.preventDefault()
      this.getRecommendations()
    })
  }

  async checkApiHealth() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/health`)
      const data = await response.json()

      if (!data.model_loaded) {
        this.showError("Model belum dimuat. Silakan coba lagi dalam beberapa saat.")
      }
    } catch (error) {
      this.showError("Tidak dapat terhubung ke server. Pastikan backend berjalan.")
    }
  }

  async getRecommendations() {
    const formData = this.getFormData()

    this.showLoading()
    this.hideError()
    this.hideRecommendations()

    try {
      // Get weather info first
      await this.getWeatherInfo(formData.location)

      // Get recommendations
      const response = await fetch(`${this.apiBaseUrl}/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        this.displayRecommendations(data.recommendations)
        this.displayWeatherInfo(data.recommendations.weather_info)
      } else {
        this.showError(data.error || "Gagal mendapatkan rekomendasi")
      }
    } catch (error) {
      this.showError("Terjadi kesalahan saat mengambil rekomendasi: " + error.message)
    } finally {
      this.hideLoading()
    }
  }

  async getWeatherInfo(location) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/weather`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ location }),
      })

      const data = await response.json()
      if (data.success) {
        this.displayWeatherInfo(data)
      }
    } catch (error) {
      console.error("Error getting weather:", error)
    }
  }

  getFormData() {
    return {
      location: document.getElementById("location").value,
      gender: document.getElementById("gender").value,
      tema: document.getElementById("tema").value,
      warna: document.getElementById("warna").value,
    }
  }

  displayRecommendations(recommendations) {
    const categories = ["Atasan", "Bawahan", "Sepatu"]

    categories.forEach((category) => {
      const containerId = category.toLowerCase() + "Recommendations"
      const container = document.getElementById(containerId)

      if (recommendations[category] && recommendations[category].length > 0) {
        container.innerHTML = this.renderCategoryRecommendations(recommendations[category])
      } else {
        container.innerHTML = this.renderNoRecommendations(category)
      }
    })

    this.showRecommendations()
  }

  renderCategoryRecommendations(items) {
    return items
      .map(
        (item) => `
            <div class="recommendation-item">
                <div class="recommendation-title">${item.productDisplayName}</div>
                <div class="recommendation-details">
                    <span class="badge-custom">${item.baseColour}</span>
                    <span class="badge-custom">${item.season}</span>
                    <span class="badge-custom">${item.usage}</span>
                </div>
                ${
                  item.link
                    ? `<a href="${item.link}" target="_blank" class="btn btn-sm btn-outline-primary mt-2">
                    <i class="fas fa-external-link-alt me-1"></i>Lihat Produk
                </a>`
                    : ""
                }
            </div>
        `,
      )
      .join("")
  }

  renderNoRecommendations(category) {
    return `
            <div class="text-center text-muted">
                <i class="fas fa-search mb-2" style="font-size: 2rem; opacity: 0.5;"></i>
                <p>Tidak ada rekomendasi ${category.toLowerCase()} yang sesuai</p>
                <small>Coba ubah preferensi Anda</small>
            </div>
        `
  }

  displayWeatherInfo(weatherInfo) {
    const weatherCard = document.getElementById("weatherCard")
    const weatherContainer = document.getElementById("weatherInfo")

    if (weatherInfo) {
      weatherContainer.innerHTML = `
                <div class="weather-info">
                    <div class="weather-temp">${Math.round(weatherInfo.temperature)}°C</div>
                    <div class="weather-desc">${weatherInfo.description}</div>
                    <div class="mt-2">
                        <small><i class="fas fa-map-marker-alt me-1"></i>${weatherInfo.location}</small>
                    </div>
                    <div class="mt-1">
                        <small><i class="fas fa-calendar me-1"></i>Season: ${weatherInfo.season}</small>
                    </div>
                </div>
            `
      weatherCard.style.display = "block"
    }
  }

  showLoading() {
    document.getElementById("loadingSpinner").style.display = "block"
    document.getElementById("getRecommendations").disabled = true
    document.getElementById("getRecommendations").innerHTML = `
            <span class="spinner-border spinner-border-sm me-2" role="status"></span>
            Memproses...
        `
  }

  hideLoading() {
    document.getElementById("loadingSpinner").style.display = "none"
    document.getElementById("getRecommendations").disabled = false
    document.getElementById("getRecommendations").innerHTML = `
            <i class="fas fa-magic me-2"></i>
            Dapatkan Rekomendasi
        `
  }

  showRecommendations() {
    document.getElementById("recommendationsContainer").style.display = "block"
  }

  hideRecommendations() {
    document.getElementById("recommendationsContainer").style.display = "none"
  }

  showError(message) {
    const errorDiv = document.getElementById("errorMessage")
    errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle me-2"></i>
            ${message}
        `
    errorDiv.style.display = "block"
  }

  hideError() {
    document.getElementById("errorMessage").style.display = "none"
  }
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new StyleMateApp()
})
