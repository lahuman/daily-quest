import { parse } from 'date-fns';

export const timeSince = (timestamp: string) => {

  const seconds = Math.floor((new Date().getTime() - parse(timestamp, 'yyyyMMddHHmmss', new Date()).getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);

  if (interval >= 1) {
    return interval + " years";
  }

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval + " months";
  }

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval + " days";
  }

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval + " hours";
  }

  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval + " minutes";
  }

  return Math.floor(seconds) + " seconds";
};

const wrapperClient = (client: Function) => async (endpoint: string, customConfig: { [key: string]: any } = {}) => {
  try {
    return await client(endpoint, customConfig);
  } catch (e: any) {

    if (e.statusCode === 401) {
      // 401 일때 refresh 토큰으로 토큰 재발급 처리 
      const token = JSON.parse(localStorage.getItem("token") || 'null');
      if (token) {
        try {
          const newToken = await client('/user/refresh', {
            method: 'POST',
            headers: {
              token: token.refresh
            }
          });
          localStorage.setItem('token', JSON.stringify(newToken));
          const user = JSON.parse(localStorage.getItem("user") || 'null');

          // 재처리 
          return await client(endpoint, customConfig);
        } catch (tokenError: any) {
          if (tokenError.statusCode === 403 || tokenError.statusCode === 500) {
            localStorage.clear();
            window.location.href = '/';
          }
        }
      } else {
        // 로그아웃
        localStorage.clear();
        window.location.href = '/';
      }
    } else if (e.statusCode === 403) {
      // 로그아웃
      localStorage.clear();
      window.location.href = '/';
    }
    throw e;
  }
}

export const client = wrapperClient((endpoint: string, { body, ...customConfig }: { [key: string]: any } = {}) => {
  const token = JSON.parse(localStorage.getItem("token") || 'null');
  const headers: { [key: string]: string } = { "Content-Type": "application/json" };

  if (token && token.token) {
    headers['Authorization'] = `Bearer ${token.token}`;
  }

  const customHeaders = customConfig['headers'] || {};

  let config: any = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customHeaders
    },
  };

  if (body) {
    config = {
      ...config,
      body: JSON.stringify(body)
    };
  }

  return fetch(`${process.env.NEXT_PUBLIC_API_HOST}${endpoint}`, config).then(
    async (res) => {
      const txt = await res.text();
      if (txt !== '') {
        const data = JSON.parse(txt);
        if (res.ok) {
          return data;
        } else {
          return Promise.reject(data);
        }
      }
    }
  );
});

