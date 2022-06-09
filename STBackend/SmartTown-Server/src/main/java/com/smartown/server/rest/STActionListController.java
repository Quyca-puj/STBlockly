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
import com.smartown.server.model.STBaseAction;
import com.smartown.server.model.STInstanceAction;
import com.smartown.server.model.dto.ActionDTO;
import com.smartown.server.model.dto.STActionListDTO;
import com.smartown.server.services.ISTActionListService;
import com.smartown.server.services.ISTBaseActionService;
import com.smartown.server.services.ISTInstanceActionService;

@RestController
@RequestMapping("actionList")
public class STActionListController {

	
	@Autowired
	private ISTActionListService aListService;
	@Autowired
	private ISTInstanceActionService instanceService;
	@Autowired
	private ISTBaseActionService baseService;
	
	
	@GetMapping("/all")
	List<STActionListDTO> getActionLists(){
		List<STActionListDTO> retList = new ArrayList<>();
		List<STActionList> aLists = aListService.getAllActionLists();
		ModelMapper mapper=new ModelMapper();
		if(aLists!=null) {
			aLists.forEach(command->{
				STActionListDTO aux = mapper.map(command, STActionListDTO.class);
				command.getActionList().forEach(action->{
					ActionDTO act = instanceService.createActionfromInstance(action);
					aux.getActions().add(act);
				});
				retList.add(aux);
			});
			
		}

		return retList;
	}
	
	
	
	@PostMapping("/new")
	STActionListDTO createNewActionList(@RequestBody STActionListDTO aList){
		System.out.println(aList);
		STActionList savedAList =  aListService.createFromDTO(aList);
		final STActionList newAList= aListService.createActionList(savedAList);
		aList.getActions().forEach(action->{
			STBaseAction baseAction = baseService.getBaseActionFromName(action.getAction());
			STInstanceAction newInstance = instanceService.createInstanceAction(action, baseAction);			
			newAList.getActionList().add(newInstance);
		});
		STActionList retList = aListService.updateActionList(newAList);
		
		ModelMapper mapper=new ModelMapper();
		STActionListDTO sendAList = mapper.map(retList, STActionListDTO.class);
		return sendAList;
	}
	
}
