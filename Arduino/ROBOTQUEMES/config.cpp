#include "config.h"

RobotConfig config;

RobotConfig::RobotConfig() {
	setDefaults();
}

void RobotConfig::setDefaults() {
	config[ConfigOptions::SPEED] = 50;
	config[ConfigOptions::SPEED_OFFSET_RIGHT] = 90;
	config[ConfigOptions::SPEED_OFFSET_LEFT] = 90;
}

int RobotConfig::getConfig(ConfigOptions co) {
	return config[co];
}

void RobotConfig::setConfig(ConfigOptions co, int new_value) {
	config[co] = new_value;
}
