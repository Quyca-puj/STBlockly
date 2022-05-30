package com.smartown.server.rest;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartown.server.model.STActionList;
import com.smartown.server.model.STCommand;
import com.smartown.server.model.dto.STActionListDTO;
import com.smartown.server.model.dto.STCommandDTO;
import com.smartown.server.services.ISTActionListService;
import com.smartown.server.services.ISTCommandService;

@RestController
@RequestMapping("actionList")
public class STActionListController {

	
	@Autowired
	private ISTActionListService aListService;
	
	
	@GetMapping("/all")
	List<STActionListDTO> getActionLists(){
		List<STActionListDTO> retList = new ArrayList<>();
		List<STActionList> aLists = aListService.getAllActionLists();
		ModelMapper mapper=new ModelMapper();
		if(aLists!=null) {
			aLists.forEach(command->{
				retList.add(mapper.map(command, STActionListDTO.class));
			});
			
		}

		return retList;
	}
	
	
	
	@PostMapping("/new")
	STActionListDTO createNewActionList(@RequestBody STActionList aList){
		
		STActionList savedAList= aListService.createActionList(aList);
		ModelMapper mapper=new ModelMapper();
		STActionListDTO sendAList = mapper.map(savedAList, STActionListDTO.class);
		return sendAList;
	}
	
}
