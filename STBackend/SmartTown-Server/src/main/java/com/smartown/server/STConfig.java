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
import com.smartown.server.model.EmotionalConfig;
import com.smartown.server.model.EmotionalConfigBundle;
import com.smartown.server.model.STActionParameter;
import com.smartown.server.model.STActionParameterBundle;
import com.smartown.server.model.STBaseAction;
import com.smartown.server.model.repository.EmotionRepository;
import com.smartown.server.model.repository.EmotionalConfigBundleRepository;
import com.smartown.server.model.repository.EmotionalConfigRepository;
import com.smartown.server.model.repository.STActionParameterBundleRepository;
import com.smartown.server.model.repository.STActionParametersRepository;
import com.smartown.server.model.repository.STBaseActionRepository;

@Configuration
/*
 * @author IQBots
 * */
public class STConfig {
	@Autowired
	Environment env;

	/*
	 * CommandLineRunner to initialize the database information related to actions, emotions and action parameters.
	 */
	@Bean
	CommandLineRunner initCommands(STBaseActionRepository baRepository, EmotionRepository emoRepository,
			STActionParametersRepository paramRepository, STActionParameterBundleRepository bundleRepository,
			EmotionalConfigRepository emoConfRepository, EmotionalConfigBundleRepository emoBundleRepository

	) {
		return args -> {

			List<String> actions = Arrays.asList(env.getProperty("st.allowed.actions").split(";"));
			List<String> emotions = Arrays.asList(env.getProperty("st.allowed.emotions").split(";"));
			List<String> params = Arrays.asList(env.getProperty("st.allowed.params").split(";"));

			params.forEach(string -> {
				String[] aux = string.split(":");
				STActionParameter param = new STActionParameter();
				param.setName(aux[0]);
				param.setType(aux[1]);
				paramRepository.save(param);
			});

			actions.forEach(string -> {
				String[] aux = string.split(",");
				STBaseAction baseAction = new STBaseAction();
				baseAction.setName(aux[0]);
				baseAction.setCustom(Boolean.parseBoolean(aux[1]));
				baseAction.setUsesArgs(Boolean.parseBoolean(aux[2]));
				baseAction.setShouldAnswer(Boolean.parseBoolean(aux[6]));
				baseAction.setEmotionOriented(Boolean.parseBoolean(aux[7]));
				baseAction.setTranslatedName(aux[5]);
				Set<String> set = new HashSet<>(Arrays.asList(aux[3].trim().split("\\|")));
				List<String> param = Arrays.asList(aux[4].trim().split("\\|"));
				List<STActionParameterBundle> parameters = new ArrayList<>();
				for (String parm : param) {

					if (!parm.trim().isBlank() && !parm.trim().isEmpty()) {
						String[] auxParam = parm.split(":");
						STActionParameter paramet = paramRepository.findByName(auxParam[0]);
						STActionParameterBundle bundle = new STActionParameterBundle();
						bundle.setParameter(paramet);
						bundle.setTranslatedName(auxParam[1]);
						bundle.setPosition(Integer.parseInt(auxParam[2]));
						bundle = bundleRepository.save(bundle);
						parameters.add(bundle);
					}

				}
				baseAction.setParams(parameters);
				baseAction.setConditions(set);
				baRepository.save(baseAction);
			});

			EmotionalConfig emoconf = new EmotionalConfig();
			List<EmotionalConfigBundle> bundle = new ArrayList<>();
			emoconf.setId(1);
			emoconf.setName("default");
			emoconf = emoConfRepository.save(emoconf);

			emotions.forEach(string -> {
				String[] aux = string.split(":");
				Emotion emotion = new Emotion();
				emotion.setName(aux[1]);
				emotion.setTranslatedName(aux[0]);
				emotion = emoRepository.save(emotion);
				EmotionalConfigBundle emoBundle = new EmotionalConfigBundle();
				emoBundle.setEmotion(emotion);
				emoBundle.setIntensity(Float.parseFloat(aux[2]));
				emoBundle = emoBundleRepository.save(emoBundle);
				bundle.add(emoBundle);
			});
			emoconf.setConfig(bundle);
			emoConfRepository.save(emoconf);
		};
	}

}
