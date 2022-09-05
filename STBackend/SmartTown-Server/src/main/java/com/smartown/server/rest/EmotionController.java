package com.smartown.server.rest;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartown.server.model.Emotion;
import com.smartown.server.model.dto.EmotionDTO;
import com.smartown.server.services.IEmotionService;

@RestController
@RequestMapping("emotions")
public class EmotionController {

	
	@Autowired
	private IEmotionService emotionService;
	
	
	@GetMapping("/all")
	List<EmotionDTO> getActionLists(){
		List<EmotionDTO> retList = new ArrayList<>();
		List<Emotion> eList = emotionService.getAllEmotions();
		ModelMapper mapper=new ModelMapper();
		if(eList!=null) {
			eList.forEach(emotion->{				
				EmotionDTO aux = mapper.map(emotion, EmotionDTO.class);			
				retList.add(aux);
			});
			
		}
		return retList;
	}

	
}
