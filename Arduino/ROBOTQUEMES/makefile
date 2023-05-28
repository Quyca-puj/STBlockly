BOARD = esp8266:esp8266:nodemcuv2
SKETCH = ROBOTQUEMES.ino
PORT = /dev/ttyUSB0

compile:
	arduino-cli compile --fqbn $(BOARD) $(SKETCH)

list:
	arduino-cli board list

upload:
	arduino-cli upload -p $(PORT) --fqbn $(BOARD) $(SKETCH)
