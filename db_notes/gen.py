# -*- coding: utf-8 -*-
import sys
import random
import json

 # 400 common english words according to http://dictionary-thesaurus.com/wordlists/Nouns%285,449%29.txt
w = """ trees trial trials triangle triangles trick tricks tries trigger triggers trim trims trip trips troop troops trouble troubles troubleshooter troubleshooters trousers truck trucks trunk trunks trust trusts truth truths try tub tube tubes tubing tubs tuesday tuesdays tug tugs tuition tumble tumbles tune tunes tunnel tunnels turbine turbines turbulence turn turnaround turnarounds turns turpitude twenties twig twigs twin twine twins twirl twirls twist twists twos type types typewriter typewriters typist typists umbrella umbrellas uncertainties uncertainty uniform uniforms union unions unit units universe update updates upside usage usages use user users uses utilities utility utilization utilizations vacuum vacuums validation validations valley valleys value values valve valves vapor vapors varactor varactors variables variation variations varieties variety vector vectors vehicle vehicles velocities velocity vendor vendors vent ventilation ventilations ventilators vents verb verbs verification verse verses version versions vessel vessels veteran veterans vibration vibrations vice vices vicinities vicinity victim victims video videos view views village villages vine vines violation violations violet visibilities visibility vision visions visit visitor visitors visits voice voices voids vol. volt voltage voltages volts volume volumes vomit voucher vouchers wafer wafers wage wages wagon wagons waist waists wait wake walk walks wall walls want war wardroom wardrooms warehouse warehouses warfare warning warnings warranties warranty wars warship warships wartime wash washer washers washes washing washtub washtubs waste wastes watch watches watchstanding water waterline waterlines waters watt watts wave waves wax waxes way ways wayside weapon weapons wear weather weathers weave weaves web webs wedding weddings weed weeds week weeks weight weights weld welder welders weldings welds wells west wheel wheels whip whips whirl whirls whisper whispers whistle whistles wholesale wholesales width widths wiggle wiggles wills win winch winches wind windings windlass windlasses window windows winds wine wines wing wingnut wingnuts wings wins winter winters wire wires wish wishes withdrawal withdrawals witness witnesses woman women wonder wonders wood woods wool wools word words work workbook workbooks workings workload workloads workman workmen works worksheet worksheets world worlds worm worms worries worry worth wounds wrap wraps wreck wrecks wrench wrenches wrist wrists writer writers writing writings yard yards yarn yarns yaw yaws year years yell yells yield yields yolk yolks zero zeros zip zips zone zones can may accounting bearing bracing briefing coupling damping ending engineering feeling heading meaning rating rigging ring schooling sizing sling winding inaction nonavailability nothing broadcast cast cost cut drunk felt forecast ground hit lent offset set shed shot slit thought wound"""

def rand_word():
	return random.choice(words)


if __name__=="__main__":
	total = int(sys.argv[1])		# total number of tuples
	max_same = int(sys.argv[2])

	words = w.split(" ")

	for i in xrange(total):
		tags = tuple(map(lambda x: random.choice(words), list(xrange(max_same))))

		print json.dumps({'exif' : {'date' : rand_word(), 'author' : rand_word(), 'model' : rand_word()},\
				'iptc': {'stars': random.randint(0,5), 'tags' : tags},\
				'url' : "http://" + rand_word(),\
				'annotations' : [{'note' : rand_word(), 'x':random.randint(0, 10), 'y':random.randint(0, 10)},\
				{'note' : rand_word(), 'x':random.randint(0, 10), 'y':random.randint(0, 10)}],\
				'thumb' : rand_word()}) + ","
