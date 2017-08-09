#
#   XXX - why is this different than "req"?
#

[ ! -d private ] && mkdir private
openssl genrsa -aes256 -out private/ca.key.pem 4096
