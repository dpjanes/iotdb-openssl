#
#   issuer.sh
#
#   David Janes
#   IOTDB
#   2017-08-09
#
#   How to get the issuer from a crt, in the shell
#

openssl x509 -in key.crt -issuer | grep '^issuer='
