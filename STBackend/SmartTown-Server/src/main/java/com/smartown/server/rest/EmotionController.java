package com.smartown.server.rest;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartown.server.model.Emotion;
import com.smartown.server.model.EmotionalConfig;
import com.smartown.server.model.dto.EmotionDTO;
import com.smartown.server.model.dto.EmotionalConfigBundleDTO;
import com.smartown.server.model.dto.EmotionalConfigDTO;
import com.smartown.server.services.IEmotionService;

@RestController
@RequestMapping("emotions")
/*
 * Emotion Rest Controller
 * @author IQBots
 */
public class EmotionController {

	@Autowired
	private IEmotionService emotionService;

	/*
	 * Get Method to get all the emotions in the database.
	 * @return list with all the emotions.
	 */
	@GetMapping("/all")
	List<EmotionDTO> getAllEmtions() {
		List<EmotionDTO> retList = new ArrayList<>();
		List<Emotion> eList = emotionService.getAllEmotions();
		ModelMapper mapper = new ModelMapper();
		if (eList != null) {
			eList.forEach(emotion -> {
				EmotionDTO aux = mapper.map(emotion, EmotionDTO.class);
				retList.add(aux);
			});

		}
		return retList;
	}
	/*
	 * Get Method to get an specific emotional configuration. If the emotional configuration doesnt exists the method returns the default one.
	 * @param name name of the configuration to search for. 
	 * @return EmotionalConfiguration DTO Object.
	 */
	@GetMapping("/emoConfig/{name}")
	EmotionalConfigDTO getEmotionalConfig(@PathVariable(value = "name") String name) {
		ModelMapper mapper = new ModelMapper();
		EmotionalConfig emoConf = emotionService.getEmotionalConfig(name);
		EmotionalConfigDTO emoConfDTO = mapper.map(emoConf, EmotionalConfigDTO.class);
		List<EmotionalConfigBundleDTO> dtosList = new ArrayList<>();
		emoConf.getConfig().forEach(conf -> {
			EmotionalConfigBundleDTO bundleDTO = mapper.map(conf, EmotionalConfigBundleDTO.class);
			EmotionDTO aux = mapper.map(conf.getEmotion(), EmotionDTO.class);
			bundleDTO.setEmotion(aux);
			dtosList.add(bundleDTO);
		});
		emoConfDTO.setConfig(dtosList);

		return emoConfDTO;
	}

}
