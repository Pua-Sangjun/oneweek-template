expires -1;
add_header  Cache-Control "no-store, no-cache, must-revalidate";
proxy_set_header    Host                $host:$server_port;
proxy_set_header    X-Real-IP           $real_ip;
proxy_set_header    X-Forwarded-For     $proxy_add_x_forwarded_for;
proxy_set_header    X-Forwarded-Proto   $real_scheme;
proxy_set_header    X-Forwarded-Port    $server_port;

# keepalive를 위한 설정
proxy_set_header Connection "";
proxy_http_version 1.1;

# proxy timeout
proxy_connect_timeout 5s;
proxy_send_timeout 120s;
proxy_read_timeout 120s;
keepalive_timeout 120s;