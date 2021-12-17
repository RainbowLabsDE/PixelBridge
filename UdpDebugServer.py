import logging
import socket

ip = "localhost"
port = 7890
log = logging.getLogger('udp_server')


def udp_server():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

    log.info("Listening on udp %s:%s" % (ip, port))
    s.bind((ip, port))
    while True:
        (data, addr) = s.recvfrom(128 * 1024)
        yield data


FORMAT_CONS = '%(asctime)s %(name)-12s %(levelname)8s\t%(message)s'
logging.basicConfig(level=logging.DEBUG, format=FORMAT_CONS)

for data in udp_server():
    formatedData = ' '.join('{:02X}'.format(x) for x in data)


    log.debug(formatedData)
