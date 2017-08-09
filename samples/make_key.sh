KEY=key
openssl req \
    -nodes \
    -x509 \
    -sha256 \
    -newkey rsa:4096 \
    -keyout "$KEY.key" \
    -out "$KEY.crt" \
    -days 365 \
    -subj "/C=CA/ST=Ontario/L=Toronto/O=Consensas/OU=IT/CN=$KEY"
