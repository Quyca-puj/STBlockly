package com.smartown.server.rest;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
/*
 * ActionList Rest Controller
 * @author IQBots
 */
public class STActionListController {

	@Autowired
	private ISTActionListService aListService;
	@Autowired
	private ISTInstanceActionService instanceService;
	@Autowired
	private ISTBaseActionService baseService;
	/*
	 * Get Method to get all the action lists in the database.
	 * @return list with all the actions lists.
	 */
	@GetMapping("/all")
	List<STActionListDTO> getActionLists() {
		List<STActionListDTO> retList = new ArrayList<>();
		List<STActionList> aLists = aListService.getAllActionLists();
		ModelMapper mapper = new ModelMapper();
		if (aLists != null) {
			aLists.forEach(command -> {

				STActionListDTO aux = mapper.map(command, STActionListDTO.class);

				aux.setActions(new ArrayList<>());
				command.getActionList().forEach(action -> {
					ActionDTO act = instanceService.createActionfromInstance(action);
					aux.getActions().add(act);
				});
				retList.add(aux);
			});

		}

		return retList;
	}

	
	/*
	 * Post Method to create a new action list.
	 * @param aList STActionListDTO object in the request body.
	 * @return STActionListDTO representing the new Action List.
	 */
	@PostMapping("/new")
	STActionListDTO createNewActionList(@RequestBody STActionListDTO aList) {
		STActionList savedAList = aListService.createFromDTO(aList);
		final STActionList newAList = aListService.createActionList(savedAList);
		final Set<String> listConditions = new HashSet<>();
		aList.getActions().forEach(action -> {
			STBaseAction baseAction = baseService.getBaseActionFromName(action.getAction());
			listConditions.addAll(baseAction.getConditions());
			STInstanceAction newInstance = instanceService.createInstanceAction(action, baseAction);
			newAList.getActionList().add(newInstance);
		});
		newAList.setConditions(listConditions);
		STActionList retList = aListService.updateActionList(newAList);

		ModelMapper mapper = new ModelMapper();
		STActionListDTO sendAList = mapper.map(retList, STActionListDTO.class);
		return sendAList;
	}

}
