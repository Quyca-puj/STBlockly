package com.smartown.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableAutoConfiguration(exclude = { SecurityAutoConfiguration.class })
@ComponentScan("com.smartown.server")
@EntityScan("com.smartown.server")
@EnableJpaRepositories("com.smartown.server")
@SpringBootApplication
/*
 * @author IQBots
 * */
public class SmartTownServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(SmartTownServerApplication.class, args);
	}

}
