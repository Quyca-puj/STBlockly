package com.smartown.server;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import com.smartown.server.model.STBaseAction;
import com.smartown.server.model.repository.STBaseActionRepository;

@Configuration
public class STConfig {
	@Autowired
	Environment env;
	@Bean
	CommandLineRunner initCommands(STBaseActionRepository baRepository) {
		return args->{
			
			List<String> actions = Arrays.asList(env.getProperty("st.allowed.actions").split(";"));
			actions.forEach(string->{
				String [] aux = string.split(",");
				STBaseAction baseAction = new STBaseAction();
				baseAction.setName(aux[0]);
				baseAction.setCustom(Boolean.parseBoolean(aux[1]));
				baseAction.setUsesArgs(Boolean.parseBoolean(aux[2]));
				baRepository.save(baseAction);
			});		
		};
	}

}
