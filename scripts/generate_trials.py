import itertools as it
import argparse
import shutil
import os
import json

# Add an optional path argument

parser = argparse.ArgumentParser(description="Creates json for trials and copy images to www/")

default_img_path = "img/"
parser.add_argument(
	'-i', '--imagedir', 
	type    = str, 
	default = default_img_path,  
	help    = f'The path to find images for trials (default is `{default_img_path}`)'
	)

default_www_path = "www/"
parser.add_argument(
	'-w', '--www', 
	type    = str, 
	default = default_www_path,  
	help    = f'The path to find images for trials (default is `{default_www_path}`)'
	)


args = parser.parse_args()


item_types = [
	"pumpkinfarmer",
	"childpresent"
]

quantifiers = [
	"some",
	"every",
	"no"
]

conditions = [
	"nonuniqtrue",
	"nonuniqfalse",
	"nonuniqmixed",
	"uniqtrue",
	"uniqfalse"
]

item_types_to_frame = {
	"pumpkinfarmer" : "{quantifier} farmer carved his pumpkin.",
	"childpresent"  : "{quantifier} child opened his present.",
}


trials = []


for (item_type, quantifier, condition) in it.product(item_types, quantifiers, conditions):
	source_image_name = f"{quantifier}_{condition}_{item_type}.png"
	source_image_path = os.path.join(args.imagedir, source_image_name)
	dest_image_path = os.path.join(args.www, source_image_path)

	os.makedirs(os.path.dirname(dest_image_path), exist_ok=True)

	try:
		shutil.copy(source_image_path, dest_image_path)
		print(f"{source_image_path} --> {dest_image_path}")
	except FileNotFoundError:
		print(f"The file {source_image_path} does not exist.")
		raise
	except PermissionError:
		print(f"Permission denied to copy {source_image_path}.")
		raise
	except Exception as e:
		print(f"An error occurred: {e}")
		raise

	trials.append({
		"condition"  : condition,
		"item_type"  : item_type,
		"quantifier" : quantifier,
		"sentence"   : item_types_to_frame[item_type].format(quantifier = quantifier.capitalize()),
		"image_src"  : source_image_path
	})


# Unfortunatety, to guarantee, that the json file is exportable to Cognition, we need to give it a .jpeg extension.
trials_file_path = os.path.join(args.www, "trials.jpeg")
with open(trials_file_path, "w") as f:
	json.dump(trials, f)
	print(f"--> {trials_file_path}")

