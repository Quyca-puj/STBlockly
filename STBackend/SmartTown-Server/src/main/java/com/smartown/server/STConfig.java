package com.smartown.server;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import com.smartown.server.model.Emotion;
import com.smartown.server.model.STActionParameter;
import com.smartown.server.model.STActionParameterBundle;
import com.smartown.server.model.STBaseAction;
import com.smartown.server.model.repository.EmotionRepository;
import com.smartown.server.model.repository.STActionParameterBundleRepository;
import com.smartown.server.model.repository.STActionParametersRepository;
import com.smartown.server.model.repository.STBaseActionRepository;

@Configuration
public class STConfig {
	@Autowired
	Environment env;
	@Bean
	CommandLineRunner initCommands(STBaseActionRepository baRepository, EmotionRepository emoRepository,
			STActionParametersRepository paramRepository, STActionParameterBundleRepository bundleRepository) {
		return args->{
			
			List<String> actions = Arrays.asList(env.getProperty("st.allowed.actions").split(";"));
			List<String> emotions = Arrays.asList(env.getProperty("st.allowed.emotions").split(";"));
			List<String> params = Arrays.asList(env.getProperty("st.allowed.params").split(";"));
			
			params.forEach(string->{
				String [] aux = string.split(":");
				STActionParameter param = new STActionParameter();
				param.setName(aux[0]);
				param.setType(aux[1]);
				paramRepository.save(param);
			});
			
			actions.forEach(string->{
				String [] aux = string.split(",");
				STBaseAction baseAction = new STBaseAction();
				baseAction.setName(aux[0]);
				baseAction.setCustom(Boolean.parseBoolean(aux[1]));
				baseAction.setUsesArgs(Boolean.parseBoolean(aux[2]));
				
				Set<String> set = new HashSet<>(Arrays.asList(aux[3].trim().split("\\|")));
				List<String> param = Arrays.asList(aux[4].trim().split("\\|"));
				List<STActionParameterBundle> parameters = new ArrayList<>();
				for (String parm : param) {
					System.out.println(parm);
					STActionParameter paramet = paramRepository.findByName(parm);
					System.out.println(paramet);
					STActionParameterBundle bundle = new STActionParameterBundle();
					bundle.setParameter(paramet);
					bundle = bundleRepository.save(bundle);
					parameters.add(bundle);
				}
				baseAction.setParams(parameters);
				baseAction.setConditions(set);
				baRepository.save(baseAction);
			});
			
			emotions.forEach(string->{
				String [] aux = string.split(":");
				Emotion emotion = new Emotion();
				emotion.setName(aux[1]);
				emotion.setTraduction(aux[0]);
				emoRepository.save(emotion);
			});
			
		};
	}

}
