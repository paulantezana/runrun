// import { notification } from 'antd';
import { BACKEND_API_V1, SESSION_KEY } from './setting';

class HttpClient {
  static setDefaultOptions(options) {
    const token = (() => {
      try {
        return JSON.parse(localStorage.getItem(SESSION_KEY))?.token ?? '';
      } catch {
        return '';
      }
    })();

    if (!(options.body instanceof FormData)) {
      options.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...(token?.length > 0 && {
          'Authorization': 'Bearer ' + token,
        }),
        ...options.headers,
      };
      options.body = JSON.stringify(options.body);
    } else {
      options.headers = {
        Accept: "application/json",
        ...(token.length > 0 && {
          'Authorization': 'Bearer ' + token,
        }),
        ...options.headers,
      };
    }

    return options;
  }

  static handleError(error, showNotification = true) {
    console.error('API Error:', error);

    if (showNotification) {
      const errorMessage = error.message || 'Ha ocurrido un error desconocido';
      alert(errorMessage);
      // notification.error({
      //   message: 'Error',
      //   description: errorMessage,
      // });
    }

    throw error;
  }

  static async handleResponse(response) {
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      return await response.json();
    } else if (contentType?.includes('application/octet-stream')) {
      return response.blob();
    } else {
      return response;
    }
  }

  static serializeQueryParams(params) {
    if (!params) return '';
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item));
      } else if (value !== null && value !== undefined) {
        searchParams.append(key, value);
      }
    });
    return searchParams.toString();
  }

  static async send(path, options = {}) {
    const {
      showNotification = true,
      rawResponse = false,
      signal,
      params,
      ...fetchOptions
    } = options;

    let url = path.startsWith('http') ? path : `${BACKEND_API_V1}${path}`;
    
    if (params) {
      const queryString = this.serializeQueryParams(params);
      url += (url.includes('?') ? '&' : '?') + queryString;
    }

    try {
      const newOptions = this.setDefaultOptions(fetchOptions);
      const response = await fetch(url, {
        ...newOptions,
        signal,
      });

      return await this.handleResponse(response);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
        return;
      }
      return this.handleError(error, showNotification);
    }
  }

  static async stream(path, options = {}) {
    const {
      showNotification = true,
      rawResponse = false,
      signal,
      params,
      onMessage, // Nueva función de callback para manejar cada mensaje de streaming
      ...fetchOptions
    } = options;
    let url = path.startsWith('http') ? path : `${BACKEND_API_V1}${path}`;
  
    if (params) {
      const queryString = this.serializeQueryParams(params);
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  
    // try {
      const newOptions = this.setDefaultOptions(fetchOptions);
      const response = await fetch(url, {
        method: 'POST',
        ...newOptions,
        signal,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
  
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
  
        if (value) {
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.startsWith('data:'));
          
          lines.forEach(line => {
            const jsonData = line.replace('data: ', '');
            try {
              const parsedData = JSON.parse(jsonData);
              if (onMessage) onMessage(parsedData); // Callback para manejar mensajes
            } catch (error) {
              console.warn('Error al parsear el mensaje de stream:', error);
            }
          });
        }
      }
    // } catch (error) {
    //   console.error(error);
    //   if (error.name === 'AbortError') {
    //     console.log('Stream abortado');
    //     return;
    //   }
    //   return this.handleError(error, options.showNotification ?? true);
    // }
  }
  

  static post(path, options = {}) {
    return this.send(path, { method: 'POST', ...options });
  }

  static put(path, options = {}) {
    return this.send(path, { method: 'PUT', ...options });
  }

  static delete(path, options = {}) {
    return this.send(path, { method: 'DELETE', ...options });
  }

  static get(path, options = {}) {
    return this.send(path, { method: 'GET', ...options });
  }

  // static stream(path, options = {}) {
  //   return this.send(path, { ...options, rawResponse: true });
  // }
}

export default HttpClient;