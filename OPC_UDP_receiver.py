# pip install pygame
# Quick script generated by ChatGPT to act as a single OPC UDP receiver for testing

import pygame
import socket
import struct

# Configuration
SCALE = 8  # Scale factor for each pixel
WIDTH = 32  # Window width in scaled pixels
HEIGHT = 32  # Window height in scaled pixels
PIXEL_COUNT = WIDTH * HEIGHT
OPC_PORT = 7890  # Port to listen for OPC data

def opc_data_to_pixels(data):
    """Convert OPC data to a list of RGB tuples."""
    pixels = []
    for i in range(0, len(data), 3):
        r = data[i]
        g = data[i+1]
        b = data[i+2]
        pixels.append((r, g, b))
    return pixels

def main():
    pygame.init()
    screen = pygame.display.set_mode((WIDTH * SCALE, HEIGHT * SCALE))
    pygame.display.set_caption("OPC Display")

    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.bind(('0.0.0.0', OPC_PORT))
    print(f"Listening for OPC data on port {OPC_PORT} via UDP...")

    running = True
    clock = pygame.time.Clock()

    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

        try:
            # OPC header is 4 bytes: channel (1 byte), command (1 byte), length (2 bytes)
            data, addr = sock.recvfrom(4 + PIXEL_COUNT * 3)
            if len(data) < 4:
                continue  # Not enough data for a header
            header = data[:4]
            channel, command, length = struct.unpack('!BBH', header)
            if command != 0:  # Only handle "Set Pixel Colors" command
                continue

            if len(data) < 4 + length:
                continue  # Not enough data for the specified length

            pixel_data = data[4:4 + length]

            # Convert OPC data to pixel colors
            pixels = opc_data_to_pixels(pixel_data)

            # Clear the screen
            screen.fill((0, 0, 0))

            # Draw pixels to the screen at the specified scale
            for i, color in enumerate(pixels):
                x = (i % WIDTH) * SCALE
                y = (i // WIDTH) * SCALE
                if y < HEIGHT * SCALE:
                    pygame.draw.rect(screen, color, (x, y, SCALE, SCALE))

            pygame.display.flip()
            clock.tick(60)  # Limit to 60 FPS

        except socket.error:
            break

    sock.close()
    pygame.quit()

if __name__ == "__main__":
    main()
