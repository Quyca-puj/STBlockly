package com.smartown.server.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartown.server.model.STActionList;
import com.smartown.server.model.STBaseAction;
import com.smartown.server.model.dto.STActionListDTO;
import com.smartown.server.model.repository.STActionListRepository;

@Service
/*
 * ActionList Service
 * @author IQBots
 */
public class STActionListService implements ISTActionListService {

	@Autowired
	private STActionListRepository repository;
	/*
	 * Method to get all the action lists in the database.
	 * @return list with all the actions lists.
	 */
	@Override
	public List<STActionList> getAllActionLists() {
		List<STActionList> list = (List<STActionList>) repository.findAll();
		if (list.size() > 0) {
			return list;
		}
		return null;
	}
	
	/*
	 * 
	 * Method to create a new action list.
	 * @param aList STActionList object. If the action list already exists it updates it.
	 * @return STActionList representing the new Action List.
	 */
	@Override
	public STActionList createActionList(STActionList aList) {
		Optional<STActionList> possibleAL = repository.findByName(aList.getName());
		if (possibleAL.isPresent()) {
			STActionList previous = possibleAL.get();
			aList.setId(previous.getId());
		}

		STActionList list = repository.save(aList);
		if (list.getActionList() == null) {
			list.setActionList(new ArrayList<>());
		}
		return list;
	}
	/*
	 * 
	 * Method to convert a STActionListDTO into an STActionList.
	 * @param in STActionListDTO object. 
	 * @return STActionList representing the Action List.
	 */
	public STActionList createFromDTO(STActionListDTO in) {
		STActionList list = new STActionList();
		list.setName(in.getName());
		return list;
	}
	/*
	 * 
	 * Method to cupdate an existing STActionList.
	 * @param newAList STActionList object. 
	 * @return STActionList representing the updated Action List.
	 */
	@Override
	public STActionList updateActionList(STActionList newAList) {

		return repository.save(newAList);
	}

}
