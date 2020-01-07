import React, { Component } from "react";
import AppTile from "../src/components/appTile/AppTile";
import { storiesOf } from "@storybook/react";
import Grid from "@material-ui/core/Grid";

export default class AppTileTest extends Component {
    constructor(props) {
        super(props);
        this.props = props;
    }
    render() {
        const apps = [
            {
                integration_date: "2013-05-24T21:44:49.000Z",
                description:
                    "This App will add existing reference annotation information to newly assembled transcripts in GFF format.",
                deleted: false,
                pipeline_eligibility: {
                    is_valid: true,
                    reason: "",
                },
                is_favorite: true,
                integrator_name:
                    "Roger Barthelson Roger Barthelson Roger Barthelson",
                beta: false,
                permission: "read",
                can_favor: true,
                disabled: false,
                can_rate: true,
                name:
                    "Bowtie-2.2.1--Build-and-Map for workflows Bowtie-2.2.1--Build-and-Map for workflowsBowtie-2.2.1--Build-and-Map for workflows",
                system_id: "de",
                is_public: true,
                id: "676846d4-854a-11e4-980d-7f0fcca75dbb",
                edited_date: "2013-05-24T20:56:03.000Z",
                step_count: 1,
                can_run: true,
                integrator_email: "rogerab@email.arizona.edu",
                app_type: "DE",
                wiki_url:
                    "http://pods.iplantcollaborative.org/wiki/display/DEapps/Annotate+transcripts",
                rating: {
                    average: 0.0,
                    total: 0,
                },
            },
            {
                integration_date: "2017-03-15T19:50:02.000Z",
                description:
                    "The APPLES (Analysis of Plant Promoter-Linked Elements) software package is a set of tools to analyse promoter sequences on a genome-wide scale. The RBH tool is part of the APPLES package which searches for orthologous as Reciprocal Best Hits (RBH).",
                deleted: false,
                pipeline_eligibility: {
                    is_valid: true,
                    reason: "",
                },
                is_favorite: false,
                integrator_name: "Uk Cyverse",
                beta: true,
                permission: "read",
                can_favor: true,
                disabled: false,
                can_rate: true,
                name: "APPLES_rbh",
                system_id: "de",
                is_public: true,
                id: "99df0c66-dce5-11e6-a30f-0242ac120003",
                edited_date: "2017-03-15T19:50:02.000Z",
                step_count: 1,
                can_run: true,
                integrator_email: "admin@cyverse.warwick.ac.uk",
                app_type: "DE",
                rating: {
                    average: 2.0,
                    total: 2,
                },
            },
            {
                integration_date: "2018-04-25T19:53:10.000Z",
                description:
                    "View, subset and filter VCF or BCF files by position and filtering expression. Convert between VCF and BCF.",
                deleted: false,
                pipeline_eligibility: {
                    is_valid: true,
                    reason: "",
                },
                is_favorite: false,
                integrator_name: "Amanda Cooksey",
                beta: true,
                permission: "read",
                can_favor: true,
                disabled: false,
                can_rate: true,
                name: "BCFtools 1.8 view",
                system_id: "de",
                is_public: true,
                id: "7b37bf52-4746-11e8-a53a-008cfa5ae621",
                edited_date: "2018-04-25T19:53:10.000Z",
                step_count: 1,
                can_run: true,
                integrator_email: "amcooksey@email.arizona.edu",
                app_type: "DE",
                rating: {
                    average: 0.0,
                    total: 0,
                },
            },
            {
                integration_date: "2012-06-13T21:01:18.000Z",
                description: "print, extract, convert and call SNPs from BCF",
                deleted: false,
                pipeline_eligibility: {
                    is_valid: true,
                    reason: "",
                },
                is_favorite: false,
                integrator_name: "Zhenyuan Lu",
                beta: false,
                permission: "read",
                can_favor: true,
                disabled: false,
                can_rate: true,
                name: "bcftools view",
                system_id: "de",
                is_public: true,
                id: "a57f406c-14b7-4601-9bfd-2604a3907bee",
                edited_date: "2012-06-13T21:01:14.000Z",
                step_count: 1,
                can_run: true,
                integrator_email: "luj@cshl.edu",
                app_type: "DE",
                wiki_url:
                    "http://pods.iplantcollaborative.org/wiki/display/DEapps/bcftools view",
                rating: {
                    average: 0.0,
                    total: 0,
                },
            },
            {
                integration_date: "2018-08-06T19:39:24.000Z",
                description: "Convert BAM to FASTQn",
                deleted: false,
                pipeline_eligibility: {
                    is_valid: true,
                    reason: "",
                },
                is_favorite: false,
                integrator_name: "Amanda Cooksey",
                beta: true,
                permission: "read",
                can_favor: true,
                disabled: false,
                can_rate: true,
                name: "bedtools 2.26.0 bam2fastq",
                system_id: "de",
                is_public: true,
                id: "7c1ff290-999e-11e8-acf9-008cfa5ae621",
                edited_date: "2018-08-06T19:39:24.000Z",
                step_count: 1,
                can_run: true,
                integrator_email: "amcooksey@email.arizona.edu",
                app_type: "DE",
                rating: {
                    average: 0.0,
                    total: 0,
                },
            },
            {
                integration_date: "2018-08-01T17:08:08.000Z",
                description:
                    "Blat, the blast-like alignment tool, which requires no premade index. This version allows many options to be set.",
                deleted: false,
                pipeline_eligibility: {
                    is_valid: true,
                    reason: "",
                },
                is_favorite: false,
                integrator_name: "Amanda Cooksey",
                beta: true,
                permission: "read",
                can_favor: true,
                disabled: false,
                can_rate: true,
                name: "Blat 36 (with options)",
                system_id: "de",
                is_public: true,
                id: "8b89b178-95aa-11e8-bab5-008cfa5ae621",
                edited_date: "2018-08-01T17:08:08.000Z",
                step_count: 1,
                can_run: true,
                integrator_email: "amcooksey@email.arizona.edu",
                app_type: "DE",
                rating: {
                    average: 0.0,
                    total: 0,
                },
            },
            {
                integration_date: "2015-04-17T09:59:37.000Z",
                description:
                    "Takes any fasta file for a reference, builds the index and then maps reads to the index. The index is saved in tar.gz form. Colorspace mapping is not available in this version, but this version maps much longer read sequences. This app can integrated into workflows in the discovery environment",
                deleted: false,
                pipeline_eligibility: {
                    is_valid: true,
                    reason: "",
                },
                is_favorite: false,
                integrator_name: "Ryan Joynson",
                beta: false,
                permission: "read",
                can_favor: true,
                disabled: false,
                can_rate: true,
                name: "Bowtie-2.2.1--Build-and-Map for workflows",
                system_id: "de",
                is_public: true,
                id: "b1f3cd8e-e424-11e4-9703-ab68be62b493",
                edited_date: "2015-04-17T09:59:37.000Z",
                step_count: 1,
                can_run: true,
                integrator_email: "ryan.joynson@liverpool.ac.uk",
                app_type: "DE",
                rating: {
                    average: 0.0,
                    total: 0,
                },
            },
            {
                integration_date: "2015-01-16T15:21:47.000Z",
                description:
                    "Bowtie2-Build creates the index files for the reference sequence(s) that can be used with bowtie2 and Tophat2 (NOT bowtie or Tophat).",
                deleted: false,
                pipeline_eligibility: {
                    is_valid: true,
                    reason: "",
                },
                is_favorite: false,
                integrator_name: "rogerab",
                beta: false,
                permission: "read",
                can_favor: true,
                disabled: false,
                can_rate: true,
                name: "Bowtie2Build-2.2.4 indexer",
                system_id: "de",
                is_public: true,
                id: "aa65db9e-9a8b-11e4-b9b7-0f1d2deb5049",
                edited_date: "2017-01-09T21:18:15.000Z",
                step_count: 1,
                can_run: true,
                integrator_email: "rogerab@email.arizona.edu",
                app_type: "DE",
                wiki_url:
                    "https://pods.iplantcollaborative.org/wiki/display/DEapps/Bowtie2Build-2.2.4+indexer",
                rating: {
                    average: 5.0,
                    total: 2,
                },
            },
            {
                integration_date: "2014-03-19T23:13:23.000Z",
                description:
                    "Index and map short reads to a reference sequence with BWA",
                deleted: false,
                pipeline_eligibility: {
                    is_valid: true,
                    reason: "",
                },
                is_favorite: false,
                integrator_name: "Roger Barthelson",
                beta: false,
                permission: "read",
                can_favor: true,
                disabled: false,
                can_rate: true,
                name: "BWA 0.7.4 non-model species",
                system_id: "de",
                is_public: true,
                id: "efc2819c-83c3-47bd-a2b4-9c96a1f56946",
                edited_date: "2014-03-19T23:13:23.000Z",
                step_count: 1,
                can_run: true,
                integrator_email: "rogerab@email.arizona.edu",
                app_type: "DE",
                wiki_url:
                    "http://pods.iplantcollaborative.org/wiki/display/DEapps/BWA+0.7.4+non-model+species",
                rating: {
                    average: 3.5,
                    total: 2,
                    user: 4,
                    comment_id: 0,
                },
            },
        ];
        const onChange = (event, value) => console.log("new rating:" + value);
        return (
            <Grid container style={{ flexGrow: 1 }} spacing={1}>
                {apps.map((app) => (
                    <Grid key={app.id} item>
                        <AppTile
                            uuid={app.id}
                            name={app.name}
                            creator={app.integrator_name}
                            rating={app.rating}
                            type={app.app_type}
                            isPublic={app.is_public}
                            isBeta={app.beta}
                            isDisabled={app.disabled}
                            isExternal={app.app_type !== "DE"}
                            isFavorite={app.is_favorite}
                            onAppInfoClick={() =>
                                console.log("App info clicked!")
                            }
                            onCommentsClick={() =>
                                console.log("Comments clicked!")
                            }
                            onFavoriteClick={() =>
                                console.log("Favorite clicked!")
                            }
                            onRatingChange={onChange}
                            onDeleteRatingClick={() =>
                                console.log("Delete rating selected!")
                            }
                            searchRegexPattern=""
                            baseDebugId="appListing"
                            onAppSelected={() => console.log("App selected!")}
                            onAppNameClick={() =>
                                console.log("App name clicked!")
                            }
                            searchText=""
                        />
                    </Grid>
                ))}
            </Grid>
        );
    }
}

storiesOf("AppTile", module).add("with app tile", () => <AppTileTest />);
