$(document).ready(function(){
    var input = {
        block_size: "",
        set_size: "",
        MM_memory_size: "",
        MM_size_type: "",
        cache_memory_size: "",
        cache_size_type: "",
        cache_cycle_time: "",
        memory_cycle_time: "",
        program_flow: "",
        program_flow_type: ""
    }

    function getInput(obj){
        obj.block_size = document.getElementById("block_size").value;
        obj.set_size = document.getElementById("set_size").value;
        obj.MM_memory_size = document.getElementById("MM_memory_size").value;
        obj.MM_size_type = document.getElementById("MM_size_type").value;
        obj.cache_memory_size = document.getElementById("cache_memory_size").value;
        obj.cache_size_type = document.getElementById("cache_size_type").value;
        obj.cache_cycle_time = document.getElementById("cache_cycle_time").value;
        obj.memory_cycle_time =  document.getElementById("memory_cycle_time").value;
        obj.program_flow = document.getElementById("program_flow").value;
        obj.program_flow_type = document.getElementById("program_flow_type").value;
    }

    function resetError(){
        document.getElementById("error").innerHTML = "";
    }

    function checkIfEmpty(obj){
        var keys = Object.keys(obj);
        var ifEmpty = false;
        keys.forEach((key, index) => {
            if(obj[key] == ""){
                ifEmpty = true;
            }
        });
        return ifEmpty;
    }

    function resetInput(){
        document.getElementById("block_size").value = "";
        document.getElementById("set_size").value= "";
        document.getElementById("MM_memory_size").value= "";
        document.getElementById("cache_memory_size").value= "";
        document.getElementById("cache_cycle_time").value= 1;
        document.getElementById("memory_cycle_time").value= 10;
        document.getElementById("program_flow").value= "";
    }

	function blockSetAssociativeMRU(input){
		var block_size = parseInt(input.block_size);
		var set_size = parseInt(input.set_size);
		var MM_memory_size = parseInt(input.MM_memory_size);
		var MM_size_type = input.MM_size_type;
		var cache_memory_size = parseInt(input.cache_memory_size);
		var cache_size_type = input.cache_size_type;
		var cache_cycle_time = parseInt(input.cache_cycle_time);
		var memory_cycle_time = parseInt(input.memory_cycle_time);
		var program_flow = input.program_flow.split(" ");
		var program_flow_type = input.program_flow_type;
		
		if (MM_size_type == "words") {
			MM_memory_size = MM_memory_size / block_size;
		}
	
		if (cache_size_type == "words") {
			cache_memory_size = cache_memory_size / block_size;
		}
		
		var num_cache_hits = 0;
		var num_cache_misses = 0;
		var miss_penalty = 0;
		var total_memory_access_time = 0;
		var no_of_sets = cache_memory_size / set_size;
		var cache_memory = new Array(no_of_sets);
	
		for (var i = 0; i < no_of_sets; i++) {
			console.log("Number of sets: " + no_of_sets);
			cache_memory[i] = [];
			for (var j = 0; j < set_size; j++) {
				cache_memory[i][j] = [];
			}
		}

		for (var i = 0; i < program_flow.length; i++) {
			var memory_address = parseInt(program_flow[i]);
			console.log("Program Flow Current Number: " + memory_address);
			
			if (program_flow_type == "words"){
				var set_index = (Math.floor(memory_address / block_size)) % no_of_sets;
			}
			else {
				var set_index = (memory_address) % no_of_sets;
			}

			var hit = false;
	
			for (var j = 0; j < cache_memory[set_index].length; j++) {
				if (cache_memory[set_index][j].address == memory_address) {
					num_cache_hits++;
					hit = true;
					cache_memory[set_index][j].timeStamp = i;
					cache_memory[set_index][j].address = memory_address;
					break;
				}
			}

			if (!hit) {
				num_cache_misses++;
	
				if (cache_memory[set_index].length != 0) {
					var maxIndex = 0;
	
					for (var j = 0; j < cache_memory[set_index].length; j++) {
						if (cache_memory[set_index][j].timeStamp > cache_memory[set_index][maxIndex].timeStamp) {
							maxIndex = j;
						}
					}
					cache_memory[set_index].splice(maxIndex, 1);
				}

				cache_memory[set_index].push({
					timeStamp: i,
					address: memory_address
				});
			}
		}

		var hit_rate = num_cache_hits / (num_cache_hits + num_cache_misses);
		miss_penalty = (2 * cache_cycle_time) + (block_size * memory_cycle_time);
		var average_memory_access_time = (hit_rate * cache_cycle_time) + ((1 - hit_rate) * miss_penalty);
		total_memory_access_time = (num_cache_hits * cache_cycle_time * block_size) + (num_cache_misses * (cache_cycle_time + memory_cycle_time) * block_size) + (num_cache_misses * cache_cycle_time);
	
		var cache_memory_snapshot = "";
		for (var i = 0; i < no_of_sets; i++) {
			for (var j = 0; j < cache_memory[i].length; j++) {
				console.log("Set Size: " + no_of_sets + "  cache memory length: " + cache_memory[i].length);
				cache_memory_snapshot += "Set " + i + ", Block " + j + " Address: " + cache_memory[i][j].address + "\n";
			}
		}

		var output = {
			num_cache_hits: num_cache_hits,
			num_cache_misses: num_cache_misses,
			miss_penalty: miss_penalty,
			average_memory_access_time: average_memory_access_time,
			total_memory_access_time: total_memory_access_time,
			cache_memory_snapshot: cache_memory_snapshot
		};
	
		// Output results
		console.log("Cache hits: " + num_cache_hits);
		console.log("Cache misses: " + num_cache_misses);
		console.log("Miss penalty: " + miss_penalty);
		console.log("Total memory access time: " + total_memory_access_time);
		console.log("Average memory access time: " + average_memory_access_time);
		console.log(cache_memory_snapshot);
	}

    $("#submit").click(function()
    {
        resetError();
        getInput(input);
        var validInput = true;
        
        if (checkIfEmpty(input))
        {
            var validInput = false;
            document.getElementById("error").innerHTML = "ERROR: Missing inputs";
        }

        if (validInput == true)
        {
            blockSetAssociativeMRU(input);
            //TODO: algorithm for block set associative - MRU
            // if (MM_size_type == word)
            // {
            //     MM_memory_size = MM_memory_size / block_size;
            // }
            // if (cache_size_type == word)
            // {
            //     cache_size_type = cache_size_type / block_size;
            // }
            //cache = new Array(set_size);
            //for (i = 0; i < set_size; i++)
            //{
            //    cache[i] = [];
            //}
            //sequence = program_flow.split(" ");
        }
    });

    $("#reset").click(function()
    {
        resetError();
        resetInput();
    });
});
