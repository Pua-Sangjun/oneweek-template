# blocked_ip 설정
geo $real_ip $blocked_ip {
  default             0;
  10.0.0.0/8          1; # 사내망
}